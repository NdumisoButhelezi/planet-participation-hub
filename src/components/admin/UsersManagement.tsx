
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

interface UsersManagementProps {
  users: User[];
  onUserUpdate: (updatedUsers: User[]) => void;
}

const UsersManagement = ({ users, onUserUpdate }: UsersManagementProps) => {
  const { toast } = useToast();

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

  return (
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
