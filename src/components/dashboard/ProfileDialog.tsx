import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import UserQRCode from "@/components/verification/UserQRCode";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(50, "Full name must be less than 50 characters"),
  studentNumber: z.string().regex(/^\d{8}$/, "Student number must be exactly 8 digits"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  course: z.string().min(2, "Course is required"),
  yearOfStudy: z.string().min(1, "Year of study is required"),
  aiInterestArea: z.string().min(3, "AI interest area must be at least 3 characters"),
  linkedinProfile: z.string().optional().refine((val) => !val || val === "" || /^https?:\/\/(www\.)?linkedin\.com\/in\//.test(val), {
    message: "Please enter a valid LinkedIn profile URL"
  }),
  githubProfile: z.string().optional().refine((val) => !val || val === "" || /^https?:\/\/(www\.)?github\.com\//.test(val), {
    message: "Please enter a valid GitHub profile URL"
  }),
  learningStyle: z.string().min(1, "Please select a learning style"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { toast } = useToast();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
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
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.profile) {
            form.reset({
              fullName: userData.profile.fullName || "",
              studentNumber: userData.profile.studentNumber || "",
              email: userData.profile.email || "",
              phoneNumber: userData.profile.phoneNumber || "",
              course: userData.profile.course || "",
              yearOfStudy: userData.profile.yearOfStudy || "",
              aiInterestArea: userData.profile.aiInterestArea || "",
              linkedinProfile: userData.profile.linkedinProfile || "",
              githubProfile: userData.profile.githubProfile || "",
              learningStyle: userData.profile.learningStyle || "",
            });
          }
          setUserName(userData.name || "User");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (open) {
      fetchProfile();
    }
  }, [open, form]);

  const onSubmit = async (data: ProfileFormData) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    setIsLoading(true);
    try {
      await updateDoc(doc(db, "users", userId), {
        profile: data
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Profile</DialogTitle>
            {auth.currentUser?.uid && (
              <UserQRCode 
                userId={auth.currentUser.uid} 
                userName={userName}
              />
            )}
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="studentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 8-digit student number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your course" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="yearOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Study</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your year of study" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="aiInterestArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Interest Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your AI interest area" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="linkedinProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="githubProfile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Profile (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="learningStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Learning Style</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your learning style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solo">Solo</SelectItem>
                      <SelectItem value="teamwork">Teamwork</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
