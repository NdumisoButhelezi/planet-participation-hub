
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ProgramAgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProgramAgreementDialog = ({ open, onOpenChange }: ProgramAgreementDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Planet 09 AI Participation Agreement</DialogTitle>
          <DialogDescription>
            <div className="prose prose-sm mt-4">
              <h2>📅 Program Duration: March 2025 – April 2025</h2>
              <p className="font-medium">🎯 Goal: Enhance students' employability through hands-on projects, workshops, hackathons, and expert guest sessions.</p>
              
              <h3>🔹 Participant Commitments</h3>
              <h4>1. Active Project Participation</h4>
              <ul>
                <li>Complete at least one (1) project within the 8-week period</li>
                <li>Document the project's progress and final outcome</li>
                <li>Create a short video (1–3 minutes) showcasing the project</li>
                <li>Post on social media using #Planet09AI</li>
              </ul>

              <h4>2. Progress Tracking (Weekly Updates Required)</h4>
              <ul>
                <li>Submit project status (GitHub/Drive link)</li>
                <li>Share social media post link</li>
                <li>Write reflection on learning</li>
              </ul>

              <h4>3. Community Engagement</h4>
              <ul>
                <li>Comment on two other participants' posts weekly</li>
                <li>Attend one hackathon/workshop/session</li>
                <li>Participate in peer reviews</li>
              </ul>

              <h3>🔹 Program Compliance</h3>
              <ul>
                <li>Missing two weeks of updates = removal</li>
                <li>No social media = no certification</li>
                <li>Top performers get exclusive opportunities</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full mt-4">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProgramAgreementDialog;
