// ============================================
// CyberWise Shared TypeScript Types
// These types mirror the Firestore data model.
// ============================================

// ---------- User & Profile ----------

export type UserRole = 'user' | 'admin' | 'moderator';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type LearningGoal =
  | 'personal-protection'
  | 'career-cybersecurity'
  | 'it-career'
  | 'student'
  | 'business-owner'
  | 'other';

export type CareerGoal =
  | 'soc-analyst'
  | 'cybersecurity-analyst'
  | 'penetration-tester'
  | 'security-engineer'
  | 'incident-responder'
  | 'digital-forensics'
  | 'threat-hunter'
  | 'cloud-security'
  | 'appsec'
  | 'not-sure';

export type ProfileVisibility = 'public' | 'private' | 'friends';

export interface UserSettings {
  emailNotifications: boolean;
  dailyChallengeReminder: boolean;
  streakReminder: boolean;
  achievementNotifications: boolean;
  recommendationNotifications: boolean;
  newContentNotifications: boolean;
  reducedMotion: boolean;
  reduceAnimations: boolean;
  fontSize: 'default' | 'large' | 'xlarge';
  highContrast: boolean;
  weeklyGoal: number; // minutes per week
  aiMentorTone: 'encouraging' | 'direct' | 'professional';
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  bio?: string;

  // Gamification
  xp: number;
  level: number;
  rank: string;
  streak: number; // consecutive days
  lastActiveDate?: string; // YYYY-MM-DD
  totalXP: number;
  badges: string[];

  // Onboarding
  onboardingCompleted: boolean;
  experienceLevel?: ExperienceLevel;
  learningGoal?: LearningGoal;
  interests?: string[];
  careerGoal?: CareerGoal;
  hasUsedLinux?: boolean;
  hasDoneCTF?: boolean;
  hasProgrammed?: boolean;
  weeklyGoalMinutes?: number;

  // Learning
  skills?: Record<string, SkillProgress>;
  learningPathIds?: string[];
  completedLessonIds?: string[];
  completedChallengeIds?: string[];
  completedStoryIds?: string[];
  completedLabIds?: string[];

  // Preferences
  profileVisibility: ProfileVisibility;
  settings: UserSettings;

  // Meta
  createdAt: any; // Timestamp
  updatedAt: any;
}

// ---------- Skills ----------

export interface SkillProgress {
  skillId: string;
  level: number; // 0-5
  xp: number;
  progress: number; // 0-100
  lastPracticed?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  level: number; // base level
  prerequisites: string[]; // skill ids
  relatedLessonIds: string[];
  relatedChallengeIds: string[];
  relatedLabIds: string[];
  icon?: string;
  order: number;
}

export type SkillCategory =
  | 'fundamentals'
  | 'networking'
  | 'linux'
  | 'windows'
  | 'web-security'
  | 'api-security'
  | 'cloud'
  | 'soc'
  | 'threat-hunting'
  | 'digital-forensics'
  | 'incident-response'
  | 'osint'
  | 'cryptography'
  | 'malware-analysis'
  | 'reverse-engineering'
  | 'offensive-security'
  | 'defensive-security'
  | 'secure-coding';

// ---------- Lessons & Learning ----------

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  xpReward: number;
  skillIds: string[];
  prerequisites: string[]; // lesson ids
  content: LessonContentBlock[];
  quizId?: string;
  relatedChallengeIds?: string[];
  relatedStoryIds?: string[];
  order: number;
  published: boolean;
}

export type LessonContentBlock =
  | { type: 'text'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'code'; language: string; code: string }
  | { type: 'list'; items: string[] }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'info'; text: string }
  | { type: 'image'; url: string; alt: string; caption?: string };

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'scenario' | 'matching' | 'identification';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  lessonId?: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // percentage
  xpReward: number;
}

// ---------- Challenges & CTF ----------

export type ChallengeType =
  | 'phishing'
  | 'log-analysis'
  | 'osint'
  | 'crypto'
  | 'web'
  | 'forensics'
  | 'network'
  | 'stego'
  | 'reverse-engineering'
  | 'linux'
  | 'windows'
  | 'misc'
  | 'secure-coding'
  | 'investigation';

export type Difficulty = 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface Challenge {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ChallengeType;
  categoryId: string;
  difficulty: Difficulty;
  points: number;
  xpReward: number;
  estimatedMinutes: number;
  learningObjectives: string[];
  prompt: string;
  flag?: string; // stored for CTF-style; validated server-side
  hintIds: string[];
  solutionExplanation: string;
  skillIds: string[];
  prerequisites: string[];
  published: boolean;
  order: number;
  createdBy?: string;
}

export interface ChallengeHint {
  id: string;
  challengeId: string;
  level: number; // 1-5
  content: string;
  costXp?: number; // optional cost
}

export interface Attempt {
  id: string;
  userId: string;
  contentType: 'challenge' | 'quiz' | 'story' | 'lesson' | 'lab';
  contentId: string;
  status: 'completed' | 'failed' | 'in-progress';
  score?: number;
  correct: boolean;
  attemptsCount: number;
  hintsUsed: number;
  timeSpentSeconds: number;
  xpEarned: number;
  submittedAt: any;
}

// ---------- Daily Challenge ----------

export interface DailyChallenge {
  id: string; // YYYY-MM-DD
  date: string;
  challengeId: string;
  type: ChallengeType;
  difficulty: Difficulty;
}

// ---------- Stories ----------

export interface Story {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImage?: string;
  genre: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  xpReward: number;
  skillIds: string[];
  learningObjectives: string[];
  conceptsCovered: string[];
  chapterIds: string[];
  finalExplanation: string;
  quizId?: string;
  published: boolean;
  order: number;
}

export interface StoryChapter {
  id: string;
  storyId: string;
  order: number;
  title: string;
  narrative: string;
  evidence?: EvidenceItem[];
  choices?: StoryChoice[];
  isFinal?: boolean;
}

export interface StoryChoice {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  nextChapterId?: string; // if branching
}

export interface EvidenceItem {
  id: string;
  label: string;
  content: string;
  type: 'email' | 'log' | 'url' | 'domain' | 'image' | 'text' | 'attachment';
}

// ---------- Gamification ----------

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'challenge' | 'streak' | 'learn' | 'milestone' | 'ctf' | 'story';
  criteria: Record<string, any>;
  xpBonus: number;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: any;
}

export interface Rank {
  id: string;
  name: string;
  minXP: number;
  icon: string;
}

// ---------- Leaderboards ----------

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  rank: number;
  period: 'global' | 'weekly' | 'monthly';
  category?: string;
}

// ---------- Certificates ----------

export interface Certificate {
  id: string;
  userId: string;
  pathId: string;
  pathName: string;
  userName: string;
  issuedAt: any;
  certificateId: string; // unique hash
  verified: boolean;
}

// ---------- Notifications ----------

export type NotificationType =
  | 'daily-challenge'
  | 'streak'
  | 'achievement'
  | 'challenge-completed'
  | 'recommendation'
  | 'new-content'
  | 'competition'
  | 'certificate'
  | 'milestone';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: any;
}

// ---------- AI Mentor ----------

export interface AIMessage {
  id: string;
  role: 'user' | 'mentor';
  content: string;
  createdAt: any;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  context?: {
    currentChallengeId?: string;
    currentLessonId?: string;
  };
  createdAt: any;
  updatedAt: any;
}

// ---------- Learning Paths ----------

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: ExperienceLevel;
  careerGoal?: CareerGoal;
  moduleIds: string[];
  xpRewardTotal: number;
  certificateAvailable: boolean;
  icon?: string;
  order: number;
  published: boolean;
}

export interface LearningModule {
  id: string;
  pathId: string;
  title: string;
  description: string;
  lessonIds: string[];
  challengeIds: string[];
  labIds?: string[];
  order: number;
  xpReward: number;
}

// ---------- Labs ----------

export interface Lab {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  estimatedMinutes: number;
  xpReward: number;
  environment: 'static' | 'container' | 'terminal';
  instructions: string[];
  flag?: string;
  hintIds: string[];
  skillIds: string[];
  prerequisites: string[];
  desktopRecommended: boolean;
  published: boolean;
}

// ---------- Knowledge Base ----------

export interface KnowledgeConcept {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  category: string;
  relatedLessonIds: string[];
  relatedStoryIds: string[];
  relatedChallengeIds: string[];
  relatedLabIds: string[];
  relatedConcepts: string[];
}

// ---------- Feedback ----------

export interface Feedback {
  id: string;
  userId: string;
  contentType: 'lesson' | 'challenge' | 'story' | 'lab' | 'quiz' | 'platform';
  contentId?: string;
  type: 'bug' | 'wrong-answer' | 'confusing' | 'inappropriate' | 'suggestion';
  message: string;
  status: 'open' | 'reviewing' | 'resolved';
  createdAt: any;
}

// ---------- Audit Log ----------

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  detail: Record<string, any>;
  createdAt: any;
  ip?: string;
}