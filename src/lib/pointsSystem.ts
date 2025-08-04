import { db } from "./firebase";
import { 
  doc, 
  updateDoc, 
  addDoc, 
  collection, 
  getDocs, 
  query, 
  where, 
  Timestamp 
} from "firebase/firestore";
import { User, Submission } from "@/types/user";

export interface PointTransaction {
  userId: string;
  pointsChange: number;
  source: "profile_completion" | "submission_approved" | "submission_rejected" | "event_attendance" | "admin_adjustment" | "bonus";
  reason: string;
  submissionId?: string;
  eventId?: string;
  adminId?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const POINT_VALUES = {
  SUBMISSION_APPROVED: 10,
  PROFILE_COMPLETION_MAX: 50,
  EVENT_ATTENDANCE: 5,
  SUBMISSION_REJECTED: -5, // Penalty for rejected submissions
} as const;

/**
 * Award points to a user and create an audit trail
 */
export async function awardPoints(
  userId: string, 
  pointsChange: number, 
  source: PointTransaction["source"],
  reason: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    // Get current user points
    const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", userId)));
    if (userDoc.empty) {
      throw new Error("User not found");
    }

    const userData = userDoc.docs[0].data() as User;
    const currentPoints = userData.points || 0;
    const newPoints = Math.max(0, currentPoints + pointsChange); // Prevent negative points

    // Update user points
    await updateDoc(doc(db, "users", userDoc.docs[0].id), {
      points: newPoints,
    });

    // Create audit entry
    const transaction: Omit<PointTransaction, "id"> = {
      userId,
      pointsChange,
      source,
      reason,
      timestamp: new Date(),
      metadata: {
        ...metadata,
        previousPoints: currentPoints,
        newPoints: newPoints,
      },
    };

    await addDoc(collection(db, "pointsAudit"), {
      ...transaction,
      timestamp: Timestamp.fromDate(transaction.timestamp),
    });

    console.log(`Awarded ${pointsChange} points to user ${userId} for ${reason}`);
  } catch (error) {
    console.error("Error awarding points:", error);
    throw error;
  }
}

/**
 * Calculate profile completion points based on filled fields
 */
export function calculateProfileCompletionPoints(user: User): number {
  const profileFields = [
    user.fullName, 
    user.studentNumber, 
    user.course, 
    user.yearOfStudy,
    user.profile?.linkedinProfile,
    user.profile?.githubProfile,
    user.profile?.aiInterestArea,
    user.profile?.phoneNumber,
    user.motivation,
  ];
  
  const completedFields = profileFields.filter(field => field && field.trim() !== "").length;
  return Math.floor((completedFields / profileFields.length) * POINT_VALUES.PROFILE_COMPLETION_MAX);
}

/**
 * Recalculate and sync profile completion points
 */
export async function syncProfileCompletionPoints(userId: string): Promise<void> {
  try {
    const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", userId)));
    if (userDoc.empty) return;

    const userData = userDoc.docs[0].data() as User;
    const newProfilePoints = calculateProfileCompletionPoints(userData);
    
    // Get existing profile completion points from audit
    const auditQuery = query(
      collection(db, "pointsAudit"),
      where("userId", "==", userId),
      where("source", "==", "profile_completion")
    );
    const auditSnapshot = await getDocs(auditQuery);
    
    const existingProfilePoints = auditSnapshot.docs.reduce((total, doc) => {
      return total + (doc.data().pointsChange || 0);
    }, 0);

    const pointsDifference = newProfilePoints - existingProfilePoints;
    
    if (pointsDifference !== 0) {
      await awardPoints(
        userId,
        pointsDifference,
        "profile_completion",
        `Profile completion update: ${newProfilePoints} total points`,
        { 
          previousProfilePoints: existingProfilePoints,
          newProfilePoints: newProfilePoints,
        }
      );
    }
  } catch (error) {
    console.error("Error syncing profile completion points:", error);
  }
}

/**
 * Award points for submission approval
 */
export async function awardSubmissionPoints(
  userId: string, 
  submissionId: string, 
  approved: boolean
): Promise<void> {
  const pointsChange = approved ? POINT_VALUES.SUBMISSION_APPROVED : POINT_VALUES.SUBMISSION_REJECTED;
  const reason = approved 
    ? `Submission approved: ${submissionId}`
    : `Submission rejected: ${submissionId}`;

  await awardPoints(
    userId,
    pointsChange,
    approved ? "submission_approved" : "submission_rejected",
    reason,
    { submissionId, approved }
  );
}

/**
 * Award points for event attendance
 */
export async function awardEventAttendancePoints(
  userId: string, 
  eventId: string, 
  eventTitle: string
): Promise<void> {
  await awardPoints(
    userId,
    POINT_VALUES.EVENT_ATTENDANCE,
    "event_attendance",
    `Event attendance: ${eventTitle}`,
    { eventId, eventTitle }
  );
}

/**
 * Get comprehensive point breakdown for a user
 */
export async function getUserPointBreakdown(userId: string): Promise<{
  totalPoints: number;
  profileCompletionPoints: number;
  submissionPoints: number;
  eventAttendancePoints: number;
  adminAdjustmentPoints: number;
  bonusPoints: number;
  transactions: PointTransaction[];
}> {
  try {
    // Get user data
    const userDoc = await getDocs(query(collection(db, "users"), where("id", "==", userId)));
    const userData = userDoc.empty ? null : userDoc.docs[0].data() as User;

    // Get all point transactions
    const auditQuery = query(
      collection(db, "pointsAudit"),
      where("userId", "==", userId)
    );
    const auditSnapshot = await getDocs(auditQuery);
    
    const transactions = auditSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        pointsChange: data.pointsChange,
        source: data.source,
        reason: data.reason,
        submissionId: data.submissionId,
        eventId: data.eventId,
        adminId: data.adminId,
        timestamp: data.timestamp?.toDate() || new Date(),
        metadata: data.metadata,
      };
    }) as PointTransaction[];

    // Calculate points by source
    const pointsBySource = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.source]) acc[transaction.source] = 0;
      acc[transaction.source] += transaction.pointsChange;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPoints: userData?.points || 0,
      profileCompletionPoints: pointsBySource.profile_completion || 0,
      submissionPoints: (pointsBySource.submission_approved || 0) + (pointsBySource.submission_rejected || 0),
      eventAttendancePoints: pointsBySource.event_attendance || 0,
      adminAdjustmentPoints: pointsBySource.admin_adjustment || 0,
      bonusPoints: pointsBySource.bonus || 0,
      transactions: transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    };
  } catch (error) {
    console.error("Error getting user point breakdown:", error);
    throw error;
  }
}