
import { useState } from "react";
import { User } from "@/types/user";
import { Shield, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      await deleteDoc(doc(db, "users", userToDelete.id));
      
      // Update local state
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      onUserUpdate(updatedUsers);
      
      toast({
        title: "Success",
        description: "User has been deleted",
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

  return (
    <>
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    {user.skillLevel} • {user.isAdmin ? "Admin" : "User"}
                  </p>
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
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user "{userToDelete?.email}"? This action cannot be undone.
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
