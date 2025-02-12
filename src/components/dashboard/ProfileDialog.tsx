
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserProfile {
  fullName: string;
  studentNumber: string;
  email: string;
  phoneNumber: string;
  course: string;
  yearOfStudy: string;
  aiInterestArea: string;
  linkedinProfile: string;
  githubProfile: string;
  learningStyle: string;
}

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    studentNumber: "",
    email: "",
    phoneNumber: "",
    course: "",
    yearOfStudy: "",
    aiInterestArea: "",
    linkedinProfile: "",
    githubProfile: "",
    learningStyle: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().profile) {
          setProfile(docSnap.data().profile);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (open) {
      fetchProfile();
    }
  }, [open]);

  const handleChange = (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    try {
      await updateDoc(doc(db, "users", userId), {
        profile: profile
      });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Full Name"
            value={profile.fullName}
            onChange={handleChange("fullName")}
          />
          
          <Input
            placeholder="Student Number"
            value={profile.studentNumber}
            onChange={handleChange("studentNumber")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={profile.email}
              onChange={handleChange("email")}
            />
            <Input
              placeholder="Phone Number"
              value={profile.phoneNumber}
              onChange={handleChange("phoneNumber")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Course"
              value={profile.course}
              onChange={handleChange("course")}
            />
            <Input
              placeholder="Year of Study"
              value={profile.yearOfStudy}
              onChange={handleChange("yearOfStudy")}
            />
          </div>

          <Input
            placeholder="AI Interest Area"
            value={profile.aiInterestArea}
            onChange={handleChange("aiInterestArea")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="LinkedIn Profile"
              value={profile.linkedinProfile}
              onChange={handleChange("linkedinProfile")}
            />
            <Input
              placeholder="GitHub Profile"
              value={profile.githubProfile}
              onChange={handleChange("githubProfile")}
            />
          </div>

          <Select 
            value={profile.learningStyle}
            onValueChange={(value) => setProfile(prev => ({ ...prev, learningStyle: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Preferred Learning Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="solo">Solo</SelectItem>
              <SelectItem value="teamwork">Teamwork</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
