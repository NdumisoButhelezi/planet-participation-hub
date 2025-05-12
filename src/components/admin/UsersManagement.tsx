import { useState, useEffect } from "react";
import { User, SkillLevel } from "@/types/user";
import { Shield, Trash2, Search, Filter, AlertTriangle, Clock, Plus, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { addWeeks, differenceInDays, parseISO, addDays, format } from "date-fns";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UsersManagementProps {
  users: User[];
  onUserUpdate: (updatedUsers: User[]) => void;
}

// Create a schema for points adjustment
const pointsAdjustmentSchema = z.object({
  points: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Points must be a valid number",
  }),
  reason: z.string().min(1, { message: "Reason is required" }),
});

// Create a schema for time extension
const timeExtensionSchema = z.object({
  days: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Days must be a positive number",
  }),
  reason: z.string().min(1, { message: "Reason is required" }),
});

const UsersManagement = ({ users, onUserUpdate }: UsersManagementProps) => {
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [isRestoring, setIsRestoring] = useState<{[key: string]: boolean}>({});
  
  // Points adjustment state
  const [isAdjustingPoints, setIsAdjustingPoints] = useState(false);
  const [userToAdjust, setUserToAdjust] = useState<User | null>(null);
  const [pointsHistory, setPointsHistory] = useState<{[key: string]: { amount: number, reason: string, date: Date }[]}>({});
  
  // Time extension state
  const [isExtendingTime, setIsExtendingTime] = useState(false);
  const [userToExtend, setUserToExtend] = useState<User | null>(null);
  const [extensionHistory, setExtensionHistory] = useState<{[key: string]: { days: number, reason: string, date: Date }[]}>({});
  
  // Form for points adjustment
  const pointsAdjustmentForm = useForm<z.infer<typeof pointsAdjustmentSchema>>({
    resolver: zodResolver(pointsAdjustmentSchema),
    defaultValues: {
      points: "",
      reason: "",
    },
  });
  
  // Form for time extension
  const timeExtensionForm = useForm<z.infer<typeof timeExtensionSchema>>({
    resolver: zodResolver(timeExtensionSchema),
    defaultValues: {
      days: "14",
      reason: "High performance extension",
    },
  });
  
  // Filter states
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | "all">("all");
  const [selectedRole, setSelectedRole] = useState<"all" | "admin" | "user">("all");
  const [selectedYearOfStudy, setSelectedYearOfStudy] = useState<string>("all");
  const [showLockedAccounts, setShowLockedAccounts] = useState<boolean>(false);
  const [showInactiveUsers, setShowInactiveUsers] = useState<boolean>(false);
  const [showEligibleForExtension, setShowEligibleForExtension] = useState<boolean>(false);

  const uniqueYearsOfStudy = [...new Set(users
    .filter(user => user.yearOfStudy)
    .map(user => user.yearOfStudy as string)
  )].sort();

  // Function to check if a user is inactive (no submission for 2+ weeks)
  const isUserInactive = (user: User) => {
    const lastSubmissionDate = user.lastSubmissionDate ? 
      (typeof user.lastSubmissionDate === 'string' ? parseISO(user.lastSubmissionDate) : user.lastSubmissionDate) : 
      null;
    
    if (!lastSubmissionDate) return true; // No submission date means user is considered inactive
    
    const twoWeeksAgo = addWeeks(new Date(), -2);
    return lastSubmissionDate < twoWeeksAgo;
  };

  // Function to check if a user is eligible for time extension (points > 200)
  const isEligibleForExtension = (user: User) => {
    return (user.points || 0) > 200;
  };

  useEffect(() => {
    // Apply all filters
    let filtered = [...users];
    
    // Apply search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(query) || 
        user.fullName?.toLowerCase().includes(query) || 
        user.studentNumber?.toLowerCase().includes(query) ||
        user.skillLevel.toLowerCase().includes(query) ||
        user.course?.toLowerCase().includes(query) ||
        user.motivation?.toLowerCase().includes(query)
      );
    }
    
    // Apply skill level filter
    if (selectedSkillLevel !== "all") {
      filtered = filtered.filter(user => user.skillLevel === selectedSkillLevel);
    }
    
    // Apply role filter
    if (selectedRole !== "all") {
      filtered = filtered.filter(user => 
        selectedRole === "admin" ? user.isAdmin : !user.isAdmin
      );
    }
    
    // Apply year of study filter
    if (selectedYearOfStudy !== "all") {
      filtered = filtered.filter(user => user.yearOfStudy === selectedYearOfStudy);
    }
    
    // Apply locked accounts filter
    if (showLockedAccounts) {
      filtered = filtered.filter(user => user.accountLocked);
    }
    
    // Apply inactive users filter
    if (showInactiveUsers) {
      filtered = filtered.filter(user => isUserInactive(user));
    }
    
    // Apply eligible for extension filter
    if (showEligibleForExtension) {
      filtered = filtered.filter(user => isEligibleForExtension(user));
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, users, selectedSkillLevel, selectedRole, selectedYearOfStudy, showLockedAccounts, showInactiveUsers, showEligibleForExtension]);

  const makeAdmin = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        isAdmin: true
      });
      
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, isAdmin: true } : user
      );
      onUserUpdate(updatedUsers);
      
      toast({
        title: "Success",
        description: "User has been made admin",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const toggleLockAccount = async (user: User) => {
    try {
      const newLockedStatus = !user.accountLocked;
      await updateDoc(doc(db, "users", user.id), {
        accountLocked: newLockedStatus,
        lockReason: newLockedStatus ? "App version incompatibility" : null
      });
      
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, accountLocked: newLockedStatus, lockReason: newLockedStatus ? "App version incompatibility" : null } : u
      );
      onUserUpdate(updatedUsers);
      
      toast({
        title: newLockedStatus ? "Account Locked" : "Account Unlocked",
        description: `User account has been ${newLockedStatus ? "locked" : "unlocked"}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete the user document from Firestore
      await deleteDoc(doc(db, "users", userToDelete.id));
      
      // Also delete any associated user data (like submissions)
      // This would require additional code to scan and delete related documents
      
      // Update local state
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      onUserUpdate(updatedUsers);
      
      toast({
        title: "Success",
        description: "User has been deleted from the database",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSkillLevel("all");
    setSelectedRole("all");
    setSelectedYearOfStudy("all");
    setShowLockedAccounts(false);
    setShowInactiveUsers(false);
    setShowEligibleForExtension(false);
  };

  const restoreUserPoints = async (user: User) => {
    setIsRestoring(prev => ({ ...prev, [user.id]: true }));
    try {
      // Default points to restore - could be made configurable
      const pointsToRestore = 100;
      
      const currentPoints = user.points || 0;
      const newPoints = currentPoints + pointsToRestore;
      
      // Update user in Firestore
      await updateDoc(doc(db, "users", user.id), {
        points: newPoints,
        lastPointsRestoreDate: new Date()
      });
      
      // Update local state
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, points: newPoints, lastPointsRestoreDate: new Date() } : u
      );
      onUserUpdate(updatedUsers);
      
      // Add to points history
      const historyItem = {
        amount: pointsToRestore,
        reason: "Points restored due to inactivity",
        date: new Date()
      };
      
      setPointsHistory(prev => ({
        ...prev,
        [user.id]: [...(prev[user.id] || []), historyItem]
      }));
      
      toast({
        title: "Points Restored",
        description: `Successfully restored ${pointsToRestore} points to ${user.fullName || user.email}.`,
      });
    } catch (error) {
      console.error("Error restoring points:", error);
      toast({
        title: "Error",
        description: "Failed to restore user points",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(prev => ({ ...prev, [user.id]: false }));
    }
  };

  const openPointsAdjustmentDialog = (user: User) => {
    setUserToAdjust(user);
    pointsAdjustmentForm.reset({
      points: "",
      reason: "",
    });
    setIsAdjustingPoints(true);
  };

  const handlePointsAdjustment = async (data: z.infer<typeof pointsAdjustmentSchema>) => {
    if (!userToAdjust) return;
    
    try {
      const adjustmentAmount = parseInt(data.points);
      if (isNaN(adjustmentAmount)) {
        toast({
          title: "Invalid Points",
          description: "Please enter a valid number for points.",
          variant: "destructive",
        });
        return;
      }
      
      const currentPoints = userToAdjust.points || 0;
      const newPoints = currentPoints + adjustmentAmount;
      
      // Don't allow negative total points
      if (newPoints < 0) {
        toast({
          title: "Invalid Adjustment",
          description: "Total points cannot be negative.",
          variant: "destructive",
        });
        return;
      }
      
      // Update user in Firestore
      await updateDoc(doc(db, "users", userToAdjust.id), {
        points: newPoints,
        lastPointsAdjustmentDate: new Date()
      });
      
      // Update local state
      const updatedUsers = users.map(u => 
        u.id === userToAdjust.id ? { 
          ...u, 
          points: newPoints, 
          lastPointsAdjustmentDate: new Date() 
        } : u
      );
      onUserUpdate(updatedUsers);
      
      // Add to points history
      const historyItem = {
        amount: adjustmentAmount,
        reason: data.reason,
        date: new Date()
      };
      
      setPointsHistory(prev => ({
        ...prev,
        [userToAdjust.id]: [...(prev[userToAdjust.id] || []), historyItem]
      }));
      
      toast({
        title: "Points Adjusted",
        description: `Successfully ${adjustmentAmount >= 0 ? 'added' : 'deducted'} ${Math.abs(adjustmentAmount)} points ${adjustmentAmount >= 0 ? 'to' : 'from'} ${userToAdjust.fullName || userToAdjust.email}.`,
      });
      
      // Close dialog
      setIsAdjustingPoints(false);
    } catch (error) {
      console.error("Error adjusting points:", error);
      toast({
        title: "Error",
        description: "Failed to adjust user points",
        variant: "destructive",
      });
    }
  };

  // New function to open the time extension dialog
  const openTimeExtensionDialog = (user: User) => {
    if (!isEligibleForExtension(user)) {
      toast({
        title: "Not Eligible",
        description: "Only users with more than 200 points are eligible for time extension.",
        variant: "destructive",
      });
      return;
    }
    
    setUserToExtend(user);
    timeExtensionForm.reset({
      days: "14",
      reason: "High performance extension",
    });
    setIsExtendingTime(true);
  };

  // New function to handle time extension
  const handleTimeExtension = async (data: z.infer<typeof timeExtensionSchema>) => {
    if (!userToExtend) return;
    
    try {
      const extensionDays = parseInt(data.days);
      if (isNaN(extensionDays) || extensionDays <= 0) {
        toast({
          title: "Invalid Days",
          description: "Please enter a positive number for days.",
          variant: "destructive",
        });
        return;
      }
      
      // Calculate the current extension and add new days
      const currentExtension = userToExtend.submissionTimeExtension || 0;
      const newExtension = currentExtension + extensionDays;
      
      // Update user in Firestore
      await updateDoc(doc(db, "users", userToExtend.id), {
        submissionTimeExtension: newExtension,
        lastTimeExtensionDate: new Date()
      });
      
      // Update local state
      const updatedUsers = users.map(u => 
        u.id === userToExtend.id ? { 
          ...u, 
          submissionTimeExtension: newExtension, 
          lastTimeExtensionDate: new Date() 
        } : u
      );
      onUserUpdate(updatedUsers);
      
      // Add to extension history
      const historyItem = {
        days: extensionDays,
        reason: data.reason,
        date: new Date()
      };
      
      setExtensionHistory(prev => ({
        ...prev,
        [userToExtend.id]: [...(prev[userToExtend.id] || []), historyItem]
      }));
      
      toast({
        title: "Time Extended",
        description: `Successfully extended submission deadline by ${extensionDays} days for ${userToExtend.fullName || userToExtend.email}.`,
      });
      
      // Close dialog
      setIsExtendingTime(false);
    } catch (error) {
      console.error("Error extending time:", error);
      toast({
        title: "Error",
        description: "Failed to extend user's submission time",
        variant: "destructive",
      });
    }
  };

  // Format the extended time information for display
  const formatExtendedTime = (user: User) => {
    if (!user.submissionTimeExtension) return null;
    
    const extensionDays = user.submissionTimeExtension;
    const lastExtensionDate = user.lastTimeExtensionDate ? 
      (typeof user.lastTimeExtensionDate === 'string' ? parseISO(user.lastTimeExtensionDate) : user.lastTimeExtensionDate) : 
      null;
    
    if (lastExtensionDate) {
      const newDeadline = addDays(lastExtensionDate, extensionDays);
      return `+${extensionDays} days (until ${format(newDeadline, 'MMM d, yyyy')})`;
    } else {
      return `+${extensionDays} days`;
    }
  };

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            User Management
          </CardTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search users by email, name, student number, skill level, course or motivation..." 
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
            <div>
              <label htmlFor="skill-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Level
              </label>
              <select
                id="skill-filter"
                value={selectedSkillLevel}
                onChange={(e) => setSelectedSkillLevel(e.target.value as SkillLevel | "all")}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="all">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                id="role-filter"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "all" | "admin" | "user")}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Regular Users</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Year of Study
              </label>
              <select
                id="year-filter"
                value={selectedYearOfStudy}
                onChange={(e) => setSelectedYearOfStudy(e.target.value)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              >
                <option value="all">All Years</option>
                {uniqueYearsOfStudy.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col justify-end gap-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="locked-accounts"
                  checked={showLockedAccounts}
                  onChange={(e) => setShowLockedAccounts(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                />
                <label htmlFor="locked-accounts" className="text-sm font-medium text-gray-700">
                  Show locked accounts
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="inactive-users"
                  checked={showInactiveUsers}
                  onChange={(e) => setShowInactiveUsers(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                />
                <label htmlFor="inactive-users" className="text-sm font-medium text-gray-700">
                  Show inactive users (2+ weeks)
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="eligible-extension"
                  checked={showEligibleForExtension}
                  onChange={(e) => setShowEligibleForExtension(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4 mr-2"
                />
                <label htmlFor="eligible-extension" className="text-sm font-medium text-gray-700">
                  Show eligible for extension (>200 points)
                </label>
              </div>
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No users match your filter criteria
              </div>
            ) : (
              <div className="text-sm text-gray-500 mb-2">
                Showing {filteredUsers.length} of {users.length} users
              </div>
            )}
            
            <div className="space-y-4">
              {filteredUsers.map(user => {
                const isInactive = isUserInactive(user);
                const canGetExtension = isEligibleForExtension(user);
                return (
                <div 
                  key={user.id} 
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    user.accountLocked ? 'bg-red-50 border border-red-200' : 
                    isInactive ? 'bg-yellow-50 border border-yellow-200' :
                    canGetExtension ? 'bg-green-50 border border-green-200' :
                    'bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{user.email}</p>
                      {user.accountLocked && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Locked
                        </Badge>
                      )}
                      {isInactive && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                      {canGetExtension && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800">
                          <Clock className="h-3 w-3" />
                          Eligible for Extension
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {user.skillLevel} • {user.isAdmin ? "Admin" : "User"}
                      {user.points !== undefined && (
                        <span className="ml-1 font-medium">
                          • {user.points} points
                        </span>
                      )}
                    </p>
                    {user.submissionTimeExtension && (
                      <p className="text-sm text-green-600 font-medium">
                        Time Extension: {formatExtendedTime(user)}
                      </p>
                    )}
                    {user.fullName && (
                      <p className="text-sm text-gray-600">{user.fullName}</p>
                    )}
                    {user.studentNumber && (
                      <p className="text-xs text-gray-500">Student ID: {user.studentNumber}</p>
                    )}
                    {user.course && (
                      <p className="text-xs text-gray-500">Course: {user.course}</p>
                    )}
                    {user.yearOfStudy && (
                      <p className="text-xs text-gray-500">Year: {user.yearOfStudy}</p>
                    )}
                    {user.accountLocked && user.lockReason && (
                      <p className="text-xs text-red-600 mt-1">
                        <strong>Lock reason:</strong> {user.lockReason}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => openPointsAdjustmentDialog(user)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <Minus className="h-4 w-4" />
                      Adjust Points
                    </Button>
                    
                    {canGetExtension && (
                      <Button 
                        variant="outline"
                        onClick={() => openTimeExtensionDialog(user)}
                        className="flex items-center gap-2 bg-green-50 text-green-800 border-green-300 hover:bg-green-100"
                      >
                        <Clock className="h-4 w-4" />
                        Extend Time
                      </Button>
                    )}
                    
                    {isInactive && !user.isAdmin && (
                      <Button 
                        variant="outline"
                        onClick={() => restoreUserPoints(user)}
                        disabled={isRestoring[user.id]}
                        className="flex items-center gap-2 bg-yellow-50 text-yellow-800 border-yellow-300 hover:bg-yellow-100"
                      >
                        {isRestoring[user.id] ? "Restoring..." : "Restore Points"}
                      </Button>
                    )}
                    <Button 
                      variant={user.accountLocked ? "default" : "outline"}
                      onClick={() => toggleLockAccount(user)}
                      className="flex items-center gap-2"
                    >
                      {user.accountLocked ? "Unlock Account" : "Lock Account"}
                    </Button>
                    {!user.isAdmin && (
                      <Button 
                        variant="outline"
                        onClick={() => makeAdmin(user.id)}
                        className="flex items-center gap-2"
                      >
                        <Shield className="h-4 w-4" />
                        Make Admin
                      </Button>
                    )}
                    <Button 
                      variant="destructive"
                      onClick={() => openDeleteDialog(user)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Adjustment Dialog */}
      <Dialog open={isAdjustingPoints} onOpenChange={setIsAdjustingPoints}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust User Points</DialogTitle>
            <DialogDescription>
              {userToAdjust?.fullName || userToAdjust?.email} current points: {userToAdjust?.points || 0}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...pointsAdjustmentForm}>
            <form onSubmit={pointsAdjustmentForm.handleSubmit(handlePointsAdjustment)} className="space-y-4 py-4">
              <FormField
                control={pointsAdjustmentForm.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points to Adjust</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number" 
                        placeholder="Enter positive or negative value"
                      />
                    </FormControl>
                    <FormDescription>
                      Use positive numbers to add points, negative to deduct.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={pointsAdjustmentForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Reason for adjustment"
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {pointsHistory[userToAdjust?.id || ""] && pointsHistory[userToAdjust?.id || ""].length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Recent Adjustments</h4>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pointsHistory[userToAdjust?.id || ""].slice(-3).map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.date.toLocaleDateString()}</TableCell>
                            <TableCell className={item.amount >= 0 ? "text-green-600" : "text-red-600"}>
                              {item.amount >= 0 ? `+${item.amount}` : item.amount}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">{item.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAdjustingPoints(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Time Extension Dialog */}
      <Dialog open={isExtendingTime} onOpenChange={setIsExtendingTime}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Extend Submission Time</DialogTitle>
            <DialogDescription>
              {userToExtend?.fullName || userToExtend?.email} - Current points: {userToExtend?.points || 0}
              {userToExtend?.submissionTimeExtension && (
                <div className="mt-1 text-green-600 font-medium">
                  Current extension: {userToExtend.submissionTimeExtension} days
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...timeExtensionForm}>
            <form onSubmit={timeExtensionForm.handleSubmit(handleTimeExtension)} className="space-y-4 py-4">
              <FormField
                control={timeExtensionForm.control}
                name="days"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days to Extend</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number" 
                        placeholder="Enter number of days"
                      />
                    </FormControl>
                    <FormDescription>
                      How many additional days to extend the submission deadline.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={timeExtensionForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Reason for extension"
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {extensionHistory[userToExtend?.id || ""] && extensionHistory[userToExtend?.id || ""].length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium">Recent Extensions</h4>
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Reason</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {extensionHistory[userToExtend?.id || ""].slice(-3).map((item, i) => (
                          <TableRow key={i}>
                            <TableCell>{item.date.toLocaleDateString()}</TableCell>
                            <TableCell className="text-green-600">
                              +{item.days}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">{item.reason}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsExtendingTime(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Extend Time
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user "{userToDelete?.email}"? This action cannot be undone.
              <div className="mt-2 text-red-500 text-sm">
                This will permanently remove the user from the Firestore database.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UsersManagement;
