
export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface User {
  id: string;
  email: string;
  skillLevel: SkillLevel;
  isAdmin: boolean;
  hasAcceptedAgreement?: boolean;
  progress?: number;
  points?: number;
  fullName?: string;
  studentNumber?: string;
  phoneNumber?: string;
  course?: string;
  yearOfStudy?: string;
  aiInterestArea?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  learningStyle?: "solo" | "teamwork" | "both";
  motivation?: string;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  projectLink: string;
  socialMediaLink: string;
  learningReflection: string;
  peersEngaged: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  skillLevel: SkillLevel;
}

export interface Playlist {
  skillLevel: SkillLevel;
  urls: string[];
}

export const PLAYLISTS: Record<SkillLevel, string[]> = {
  beginner: [
    "https://youtube.com/playlist?list=PLnbRHHpYESGILKGfoOn-Bxlk9_O2izivX",
    "https://youtube.com/playlist?list=PLnbRHHpYESGKa-tkA3Tr_A_xQiHDm0kaK"
  ],
  intermediate: [
    "https://youtube.com/playlist?list=PLnbRHHpYESGIKkP62ebY8fHnraAn4xf8J"
  ],
  advanced: [
    "https://youtube.com/playlist?list=PLnbRHHpYESGJ2NNCMFdmTEzzSKfJQb-Rn"
  ]
};
