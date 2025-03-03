
import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally send the email via an API
      // For now we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log the submission details
      console.log("Message submitted to: ndumisobuthelezi028@gmail.com");
      console.log("From:", email);
      console.log("Message:", message);
      
      // Show success message
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!",
      });
      
      // Clear the form
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-8 text-indigo-100">Have questions about our AI learning platform? Send us a message and our team will get back to you.</p>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <CheckCircle className="text-indigo-300" />
                <span>24/7 Support for enrolled students</span>
              </div>
              <div className="flex items-center space-x-4">
                <CheckCircle className="text-indigo-300" />
                <span>Weekly live Q&A sessions</span>
              </div>
              <div className="flex items-center space-x-4">
                <CheckCircle className="text-indigo-300" />
                <span>Dedicated mentors for premium members</span>
              </div>
            </div>
          </div>
          
          <div data-aos="fade-left" className="bg-white/10 backdrop-blur-md p-8 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Your email"
                  className="bg-white/20 border-indigo-300 text-white placeholder:text-indigo-200"
                  required
                />
              </div>
              <div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you with AI learning?"
                  className="bg-white/20 border-indigo-300 text-white placeholder:text-indigo-200 min-h-[100px]"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-white text-indigo-900 hover:bg-indigo-100" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"} <Send className="ml-2 w-4 h-4" />
              </Button>
              <p className="text-xs text-center text-indigo-200 mt-2">
                Your message will be sent to ndumisobuthelezi028@gmail.com
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
