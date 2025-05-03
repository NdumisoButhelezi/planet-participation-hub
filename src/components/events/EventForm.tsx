
import { Event, Perspective } from "@/types/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <span>Staff</span>
              </div>
            </div>
          </div>

          <Textarea
            placeholder="Objectives"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            disabled={isSubmitting}
          />

          <Textarea
            placeholder="Outcome"
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            disabled={isSubmitting}
          />

          <Input
            type="number"
            placeholder="Perspective Weighting"
            value={perspectiveWeighting}
            onChange={(e) => setPerspectiveWeighting(e.target.value)}
            min="0"
            max="100"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {selectedEvent ? "Updating..." : "Creating..."}
              </>
            ) : (
              selectedEvent ? "Update Event" : "Create Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
