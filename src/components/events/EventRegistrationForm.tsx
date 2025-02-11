
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface EventRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
}

const EventRegistrationForm = ({ open, onOpenChange, eventId }: EventRegistrationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    studentNumber: "",
    email: "",
    phoneNumber: "",
    course: "",
    yearOfStudy: "",
    aiInterestArea: "",
    linkedinProfile: "",
    githubProfile: "",
    learningStyle: "",
    motivation: ""
  });

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
        status: "pending",
        createdAt: new Date(),
      });

      toast({
        title: "Success",
        description: "Registration submitted successfully",
      });
      
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
          <DialogTitle>Event Registration</DialogTitle>
        </DialogHeader>
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

            <Input
              placeholder="AI Interest Area (ML, Data Science, NLP, etc.)"
              value={formData.aiInterestArea}
              onChange={handleChange("aiInterestArea")}
              required
            />

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

          <DialogFooter>
            <Button type="submit">Submit Registration</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistrationForm;
