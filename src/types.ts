export type Role = 'admin' | 'staff' | 'student';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  avatar_url: string | null;
  email: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
}

export interface ClassSession {
  id: string;
  course_id: string;
  teacher_name: string;
  schedule: string; // Stored as text description for MVP, e.g., "Mon/Wed 19:00"
  capacity: number;
  start_date: string;
  course?: Course;
}

export type EnrollmentStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Enrollment {
  id: string;
  user_id: string;
  class_id: string;
  status: EnrollmentStatus;
  created_at: string;
  paid: boolean;
  receipt_url?: string; // URL for payment proof/document
  class?: ClassSession & { course: Course };
  profile?: Profile; // Joined for admin view
}

export interface StatData {
  name: string;
  value: number;
  [key: string]: any;
}