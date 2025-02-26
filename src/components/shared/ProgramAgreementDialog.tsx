
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProgramAgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProgramAgreementDialog = ({ open, onOpenChange }: ProgramAgreementDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-playfair">Planet 09 AI Participation Agreement</DialogTitle>
          <DialogDescription>
            <div className="prose prose-lg mt-4 space-y-6 text-gray-700">
              <h2 className="text-xl font-playfair text-blue-600">📅 Program Duration: March 2025 – April 2025</h2>
              <p className="font-medium text-lg">🎯 Goal: Enhance students' employability through hands-on projects, workshops, hackathons, and expert guest sessions.</p>
              
              <div className="space-y-6">
                <h3 className="text-lg font-playfair text-blue-600">🔹 Participant Commitments</h3>
                <div className="pl-4">
                  <h4 className="font-semibold">1. Active Project Participation</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Complete at least one (1) project within the 8-week period</li>
                    <li>Document the project's progress and final outcome</li>
                    <li>Create a short video (1–3 minutes) showcasing the project</li>
                    <li>Post on social media using #Planet09AI</li>
                  </ul>
                </div>

                <div className="pl-4">
                  <h4 className="font-semibold">2. Progress Tracking (Weekly Updates Required)</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Submit project status (GitHub/Drive link)</li>
                    <li>Share social media post link</li>
                    <li>Write reflection on learning</li>
                  </ul>
                </div>

                <div className="pl-4">
                  <h4 className="font-semibold">3. Community Engagement</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Comment on two other participants' posts weekly</li>
                    <li>Attend one hackathon/workshop/session</li>
                    <li>Participate in peer reviews</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-playfair text-blue-600">🔹 Program Compliance</h3>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Missing two weeks of updates = removal</li>
                  <li>No social media = no certification</li>
                  <li>Top performers get exclusive opportunities</li>
                </ul>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-colors duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramAgreementDialog;
