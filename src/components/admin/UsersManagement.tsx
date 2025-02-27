
import { useState, useEffect } from "react";
import { User, SkillLevel } from "@/types/user";
import { Shield, Trash2, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UsersManagementProps {
  users: User[];
  onUserUpdate: (updatedUsers: User[]) => void;
}

const UsersManagement = ({ users, onUserUpdate }: UsersManagementProps) => {
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  
  // Filter states
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel | "all">("all");
  const [selectedRole, setSelectedRole] = useState<"all" | "admin" | "user">("all");
  const [selectedYearOfStudy, setSelectedYearOfStudy] = useState<string>("all");

  const uniqueYearsOfStudy = [...new Set(users
    .filter(user => user.yearOfStudy)
    .map(user => user.yearOfStudy as string)
  )].sort();

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
    
    setFilteredUsers(filtered);
  }, [searchQuery, users, selectedSkillLevel, selectedRole, selectedYearOfStudy]);

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
            
            <div className="flex items-end">
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
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{user.email}</p>
                    <p className="text-sm text-gray-600">
                      {user.skillLevel} • {user.isAdmin ? "Admin" : "User"}
                    </p>
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
                  </div>
                  <div className="flex gap-2">
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
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

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
