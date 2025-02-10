
export type Perspective = "STEWARDSHIP" | "SUSTAINABILITY" | "SOCIETY" | "SYSTEMS AND PROCESSES";

export interface Event {
  id: string;
  perspective: Perspective;
  name: string;
  date: string;
  targetGroup: ("Student" | "Staff")[];
  objectives: string;
  outcome: string;
  perspectiveWeighting: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}
