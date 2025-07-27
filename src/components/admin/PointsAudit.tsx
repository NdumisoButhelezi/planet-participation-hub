import { useState, useMemo, useEffect } from "react";
import { User, Submission } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Minus, Trophy, FileText, User as UserIcon, History, Download } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, updateDoc, addDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";

interface PointsAuditProps {
  users: User[];
  submissions: Submission[];
}

interface PointAuditEntry {
  id?: string;
  userId: string;
  pointsChange: number;
  source: "profile_completion" | "submission" | "admin_adjustment" | "event_attendance" | "bonus";
  reason: string;
  submissionId?: string;
  adminId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const adjustPointsSchema = z.object({
  points: z.string().refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  reason: z.string().min(3, "Reason must be at least 3 characters"),
  type: z.enum(["add", "subtract", "set"]),
});

const PointsAudit = ({ users, submissions }: PointsAuditProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [auditEntries, setAuditEntries] = useState<PointAuditEntry[]>([]);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const adjustForm = useForm<z.infer<typeof adjustPointsSchema>>({
    resolver: zodResolver(adjustPointsSchema),
    defaultValues: {
      points: "",
      reason: "",
      type: "add",
    },
  });

  // Calculate point breakdown for each user
  const usersWithPointBreakdown = useMemo(() => {
    return users.map(user => {
      const userSubmissions = submissions.filter(sub => sub.userId === user.id && sub.status === "approved");
      // Since submissions don't have points field, we'll assume 10 points per approved submission
      const submissionPoints = userSubmissions.length * 10;
      
      // Calculate profile completion points using existing User fields
      const profileFields = [
        user.fullName, 
        user.studentNumber, 
        user.course, 
        user.yearOfStudy,
        user.profile?.linkedinProfile,
        user.profile?.githubProfile,
        user.profile?.aiInterestArea
      ];
      const completedFields = profileFields.filter(field => field && field.trim() !== "").length;
      const profileCompletionPoints = Math.floor((completedFields / profileFields.length) * 50); // Max 50 points for complete profile
      
      const totalCalculatedPoints = submissionPoints + profileCompletionPoints;
      const pointDiscrepancy = (user.points || 0) - totalCalculatedPoints;

      return {
        ...user,
        submissionPoints,
        profileCompletionPoints,
        totalCalculatedPoints,
        pointDiscrepancy,
        submissionCount: userSubmissions.length,
      };
    });
  }, [users, submissions]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return usersWithPointBreakdown;
    
    return usersWithPointBreakdown.filter(user =>
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.studentNumber?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [usersWithPointBreakdown, searchQuery]);

  // Load audit entries for selected user
  useEffect(() => {
    if (selectedUser) {
      loadAuditEntries(selectedUser.id);
    }
  }, [selectedUser]);

  const loadAuditEntries = async (userId: string) => {
    try {
      setIsLoading(true);
      const auditQuery = query(
        collection(db, "pointsAudit"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(auditQuery);
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as PointAuditEntry[];
      
      setAuditEntries(entries);
    } catch (error) {
      console.error("Error loading audit entries:", error);
      toast({
        title: "Error",
        description: "Failed to load audit entries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePointsAdjustment = async (data: z.infer<typeof adjustPointsSchema>) => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      const pointsChange = Number(data.points);
      let newPoints = selectedUser.points || 0;

      switch (data.type) {
        case "add":
          newPoints += pointsChange;
          break;
        case "subtract":
          newPoints -= pointsChange;
          break;
        case "set":
          newPoints = pointsChange;
          break;
      }

      // Ensure points don't go negative
      newPoints = Math.max(0, newPoints);

      // Update user points
      await updateDoc(doc(db, "users", selectedUser.id), {
        points: newPoints,
      });

      // Create audit entry
      const auditEntry: Omit<PointAuditEntry, "id"> = {
        userId: selectedUser.id,
        pointsChange: data.type === "set" ? newPoints - (selectedUser.points || 0) : 
                     data.type === "add" ? pointsChange : -pointsChange,
        source: "admin_adjustment",
        reason: data.reason,
        adminId: "current-admin", // Replace with actual admin ID
        timestamp: new Date(),
        metadata: {
          adjustmentType: data.type,
          previousPoints: selectedUser.points || 0,
          newPoints: newPoints,
        },
      };

      await addDoc(collection(db, "pointsAudit"), auditEntry);

      // Update local state
      setSelectedUser({ ...selectedUser, points: newPoints });
      await loadAuditEntries(selectedUser.id);

      toast({
        title: "Success",
        description: `Points ${data.type === "set" ? "set to" : data.type === "add" ? "added" : "subtracted"} successfully`,
      });

      setIsAdjustDialogOpen(false);
      adjustForm.reset();
    } catch (error) {
      console.error("Error adjusting points:", error);
      toast({
        title: "Error",
        description: "Failed to adjust points",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportAuditData = () => {
    if (!selectedUser) return;

    const csvData = [
      ["Date", "Points Change", "Source", "Reason", "Admin", "Submission ID"],
      ...auditEntries.map(entry => [
        format(entry.timestamp, "yyyy-MM-dd HH:mm:ss"),
        entry.pointsChange.toString(),
        entry.source,
        entry.reason,
        entry.adminId || "System",
        entry.submissionId || "N/A"
      ])
    ];

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `points-audit-${selectedUser.fullName || selectedUser.email}-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "profile_completion":
        return <UserIcon className="h-4 w-4" />;
      case "submission":
        return <FileText className="h-4 w-4" />;
      case "admin_adjustment":
        return <Trophy className="h-4 w-4" />;
      case "event_attendance":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Plus className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case "profile_completion":
        return "bg-blue-100 text-blue-800";
      case "submission":
        return "bg-green-100 text-green-800";
      case "admin_adjustment":
        return "bg-purple-100 text-purple-800";
      case "event_attendance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Points Audit</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Users Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUser?.id === user.id
                      ? "bg-primary/10 border-primary"
                      : "bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{user.fullName || user.email}</p>
                      <p className="text-sm text-muted-foreground">{user.studentNumber}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {user.points || 0} pts
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {user.submissionCount} submissions
                        </Badge>
                      </div>
                    </div>
                    {user.pointDiscrepancy !== 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {user.pointDiscrepancy > 0 ? "+" : ""}{user.pointDiscrepancy}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Profile: {user.profileCompletionPoints} pts</span>
                      <span>Submissions: {user.submissionPoints} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected User Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {selectedUser ? "Points History" : "Select a User"}
              </span>
              {selectedUser && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportAuditData}
                    className="flex items-center gap-1"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Dialog open={isAdjustDialogOpen} onOpenChange={setIsAdjustDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Adjust Points
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adjust Points for {selectedUser.fullName || selectedUser.email}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={adjustForm.handleSubmit(handlePointsAdjustment)} className="space-y-4">
                        <div>
                          <Label>Adjustment Type</Label>
                          <Select
                            value={adjustForm.watch("type")}
                            onValueChange={(value) => adjustForm.setValue("type", value as "add" | "subtract" | "set")}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="add">Add Points</SelectItem>
                              <SelectItem value="subtract">Subtract Points</SelectItem>
                              <SelectItem value="set">Set Total Points</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Points</Label>
                          <Input
                            {...adjustForm.register("points")}
                            type="number"
                            placeholder="Enter points"
                          />
                          {adjustForm.formState.errors.points && (
                            <p className="text-sm text-destructive mt-1">
                              {adjustForm.formState.errors.points.message}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label>Reason</Label>
                          <Textarea
                            {...adjustForm.register("reason")}
                            placeholder="Explain why you're adjusting points..."
                            rows={3}
                          />
                          {adjustForm.formState.errors.reason && (
                            <p className="text-sm text-destructive mt-1">
                              {adjustForm.formState.errors.reason.message}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsAdjustDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adjusting..." : "Adjust Points"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <div className="space-y-4">
                {/* Points Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Current Points</p>
                    <p className="text-2xl font-bold">{selectedUser.points || 0}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Submissions</p>
                    <p className="text-2xl font-bold">{submissions.filter(sub => sub.userId === selectedUser.id).length}</p>
                  </div>
                </div>

                {/* Audit Trail */}
                <div>
                  <h4 className="font-medium mb-2">Recent Activity</h4>
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary"></div>
                    </div>
                  ) : auditEntries.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {auditEntries.map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                          <div className={`p-1 rounded-full ${getSourceColor(entry.source)}`}>
                            {getSourceIcon(entry.source)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {entry.pointsChange > 0 ? "+" : ""}{entry.pointsChange} points
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {entry.source.replace("_", " ")}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {entry.reason}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(entry.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No audit entries found.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a user to view their points history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PointsAudit;