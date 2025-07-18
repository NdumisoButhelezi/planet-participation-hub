export type SkillLevel = "beginner" | "intermediate" | "advanced";

export interface UserProfile {
  fullName?: string;
  studentNumber?: string;
  phoneNumber?: string;
  course?: string;
  yearOfStudy?: string;
  aiInterestArea?: string;
  linkedinProfile?: string;
  githubProfile?: string;
  learningStyle?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  skillLevel: SkillLevel;
  hasAcceptedAgreement: boolean;
  isAdmin: boolean;
  points?: number;
  progress?: number;
  registrationDate?: Date;
  fullName?: string;
  course?: string;
  yearOfStudy?: string;
  accountLocked?: boolean;
  lockReason?: string;
  studentNumber?: string;
  motivation?: string;
  lastSubmissionDate?: Date | string;
  lastPointsRestoreDate?: Date | string;
  lastPointsAdjustmentDate?: Date | string;
  submissionTimeExtension?: number; // Number of additional days granted
  lastTimeExtensionDate?: Date | string;
  profile?: UserProfile;
  profileImage?: string; // Added profileImage property
  needsPasswordReset?: boolean; // Flag for admin-initiated password reset
}

export interface UserWithAnalytics extends User {
  submissionCount: number;
  lastSubmissionDate: Date | string | null;
  engagementRate: number;
  daysSinceLastSubmission: number;
  isActive: boolean;
  daysToNextSubmission: number;
  nextSubmissionDate: Date | null;
  hasTimeExtension: boolean;
}

export interface Submission {
  id: string;
  userId: string;
  taskId: string;
  content: string;
  projectLink: string;
  socialMediaLink: string;
  peersEngaged: number;
  learningReflection: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: Date;
}

export const PLAYLISTS = {
  beginner: [
    "https://www.youtube.com/playlist?list=PLbVHz4urQBZm7_y0dxPfYC81mE3SqFRTr",
    "https://www.youtube.com/playlist?list=PLbVHz4urQBZnSMFJ0rnyZZvF0RdDejBoz",
  ],
  intermediate: [
    "https://www.youtube.com/playlist?list=PLbVHz4urQBZkkgRrXx9LMpFdHMgygHDj3",
    "https://www.youtube.com/playlist?list=PLbVHz4urQBZlXa91KF-c8lYEx0L1OeKtG",
  ],
  advanced: [
    "https://www.youtube.com/playlist?list=PLbVHz4urQBZmJnbDiZJZB0s7J7ffq9LLl",
    "https://www.youtube.com/playlist?list=PLbVHz4urQBZln0BKln-IDIoiQokkJbFV3",
  ],
  // Authentication series available for all levels
  authSeries: [
    "https://youtu.be/SHFIuz0wrrE",
    "https://youtu.be/spfIpRV_g80",
    "https://youtu.be/Ln9zY8GM5kA",
    "https://youtu.be/2rGkWojr8Fg",
    "https://youtu.be/AKzBv9EnFew"
  ]
};
