
import { Event, Perspective } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEvent: Event | null;
  onSubmit: () => Promise<void>;
  perspective: Perspective;
  setPerspective: (perspective: Perspective) => void;
  name: string;
  setName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
  targetGroup: ("Student" | "Staff")[];
  setTargetGroup: (targetGroup: ("Student" | "Staff")[]) => void;
  objectives: string;
  setObjectives: (objectives: string) => void;
  outcome: string;
  setOutcome: (outcome: string) => void;
  perspectiveWeighting: string;
  setPerspectiveWeighting: (weight: string) => void;
}

const EventForm = ({
  open,
  onOpenChange,
  selectedEvent,
  onSubmit,
  perspective,
  setPerspective,
  name,
  setName,
  date,
  setDate,
  targetGroup,
  setTargetGroup,
  objectives,
  setObjectives,
  outcome,
  setOutcome,
  perspectiveWeighting,
  setPerspectiveWeighting,
}: EventFormProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={perspective}
            onValueChange={(value) => setPerspective(value as Perspective)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select perspective" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STEWARDSHIP">Stewardship</SelectItem>
              <SelectItem value="SUSTAINABILITY">Sustainability</SelectItem>
              <SelectItem value="SOCIETY">Society</SelectItem>
              <SelectItem value="SYSTEMS AND PROCESSES">Systems and Processes</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Target Group</label>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={targetGroup.includes("Student")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTargetGroup([...targetGroup, "Student"]);
                    } else {
                      setTargetGroup(targetGroup.filter(g => g !== "Student"));
                    }
                  }}
                />
                <span>Student</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={targetGroup.includes("Staff")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setTargetGroup([...targetGroup, "Staff"]);
                    } else {
                      setTargetGroup(targetGroup.filter(g => g !== "Staff"));
                    }
                  }}
                />
                <span>Staff</span>
              </div>
            </div>
          </div>

          <Textarea
            placeholder="Objectives"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
          />

          <Textarea
            placeholder="Outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Perspective Weighting"
            value={perspectiveWeighting}
            onChange={(e) => setPerspectiveWeighting(e.target.value)}
            min="0"
            max="100"
          />
        </div>
        <DialogFooter>
          <Button onClick={onSubmit}>
            {selectedEvent ? "Update Event" : "Create Event"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
