import { User } from './user.model';

export interface TrackStep {
  _id: string;
  title: string;
  position: number;
  duration: number;
  content_url: string;
  type: string;
  platform: string; // youtube, vimeo, google-drive, ...

  // Phục vụ cho mục đích hiển thị
  isCompleted: boolean;
}

export interface Track {
  _id: string;
  courseId: string;
  position: number;
  chapterTitle: string;
  track_steps: TrackStep[];

  // Phục vụ cho mục đích hiển thị
  showBody: boolean;
  isCompleted: boolean;
}

export interface Course {
  _id: string;
  title: string;
  titleDescription: string;
  subTitle: string;
  subTitleDescription: string[];
  enrollmentCount: number;
  status: string;
  type: string;
  amount: number;
  thumbnail: string;
  lecture: User;
  tracks: Track[];
  semester_number: number;
  created_at: Date;
  updated_at: Date;
}

export interface EnrollCourse {
  _id: string;
  user: EnrollCourseUser;
  course: Course;
  progress: number;
  enrolledDate: Date;
  trackProgress: TrackProcess[];
  completed: boolean;
}

export interface EnrollCourseUser {
  _id: string;
  email: string;
  fullName: string;
  profileName: string;
  profile_image: string;
}

export interface TrackProcess {
  _id: string;
  courseId: string;
  chapterTitle: string;
  track: Track;
  subTrackProgress: TrackStepProcess[];
  completed: boolean;

  // Phục vụ cho mục đích hiển thị
  showBody: boolean;
}

export interface TrackStepProcess {
  subTrackId: TrackStep;
  completed: boolean;
  _id: string;
}

export interface FileStatus {
  filename: string;
  progress: number;
  uploadedBytes: number;
  size: number;
  message?: string; // For pending, completed, failed
}
