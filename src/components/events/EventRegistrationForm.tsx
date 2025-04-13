
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Trophy } from "lucide-react";

interface EventRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  onSuccess?: () => void;
}

const AI_INTERESTS = [
  "Machine Learning",
  "Data Science",
  "Natural Language Processing",
  "Computer Vision",
  "Robotics",
  "Deep Learning",
  "Reinforcement Learning"
];

const EventRegistrationForm = ({ open, onOpenChange, eventId, onSuccess }: EventRegistrationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    studentNumber: "",
    email: "",
    phoneNumber: "",
    course: "",
    yearOfStudy: "",
    aiInterestArea: [] as string[],
    linkedinProfile: "",
    githubProfile: "",
    learningStyle: "",
    motivation: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().profile) {
          const profile = docSnap.data().profile;
          setFormData(prev => ({
            ...prev,
            fullName: profile.fullName || "",
            studentNumber: profile.studentNumber || "",
            email: profile.email || "",
            phoneNumber: profile.phoneNumber || "",
            course: profile.course || "",
            yearOfStudy: profile.yearOfStudy || "",
            linkedinProfile: profile.linkedinProfile || "",
            githubProfile: profile.githubProfile || "",
            learningStyle: profile.learningStyle || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (open) {
      fetchUserProfile();
    }
  }, [open]);

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      aiInterestArea: checked 
        ? [...prev.aiInterestArea, interest]
        : prev.aiInterestArea.filter(i => i !== interest)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        toast({
          title: "Error",
          description: "You must be logged in to register for events",
          variant: "destructive",
        });
        return;
      }

      await addDoc(collection(db, "eventRegistrations"), {
        ...formData,
        eventId,
        userId,
        status: "pending", // Admin needs to approve to award points
        createdAt: new Date(),
      });

      toast({
        title: "Success",
        description: "Registration submitted successfully. If approved, you'll earn 100 points!",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit registration",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Event Registration
            <div className="bg-blue-50 p-1 rounded-full ml-2">
              <Trophy className="h-5 w-5 text-amber-500" />
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="bg-blue-50 p-3 rounded-md mb-4 text-sm text-blue-600 flex items-start">
          <div className="flex-shrink-0 mr-2 mt-0.5">
            <Trophy className="h-4 w-4 text-amber-500" />
          </div>
          <p>
            Complete this registration and get approved by an admin to earn <span className="font-semibold">100 points</span> on the leaderboard!
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange("fullName")}
              required
            />
            
            <Input
              placeholder="Student Number"
              value={formData.studentNumber}
              onChange={handleChange("studentNumber")}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange("email")}
                required
              />
              <Input
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange("phoneNumber")}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Course"
                value={formData.course}
                onChange={handleChange("course")}
                required
              />
              <Input
                placeholder="Year of Study"
                value={formData.yearOfStudy}
                onChange={handleChange("yearOfStudy")}
                required
              />
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-700">AI Interest Areas:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AI_INTERESTS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.aiInterestArea.includes(interest)}
                      onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                    />
                    <label htmlFor={interest} className="text-sm text-gray-600">
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="LinkedIn Profile"
                value={formData.linkedinProfile}
                onChange={handleChange("linkedinProfile")}
                required
              />
              <Input
                placeholder="GitHub Profile"
                value={formData.githubProfile}
                onChange={handleChange("githubProfile")}
                required
              />
            </div>

            <Select 
              value={formData.learningStyle}
              onValueChange={(value) => setFormData(prev => ({ ...prev, learningStyle: value }))}
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

            <Textarea
              placeholder="Motivation for Joining"
              value={formData.motivation}
              onChange={handleChange("motivation")}
              required
              className="min-h-[100px]"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto"
            >
              Submit Registration
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationForm;
