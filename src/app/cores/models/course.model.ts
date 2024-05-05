import { User } from './user.model';

export interface TrackStep {
  _id: string;
  title: string;
  position: number;
  duration: number;
  content_url: string;
  type: string;
}

export interface Track {
  _id: string;
  courseId: string;
  position: number;
  chapterTitle: string;
  track_steps: TrackStep[];
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
  createAt: Date;
  lecture: User;
  tracks: Track[];
  semester_number: number;
}

export interface FileStatus {
  filename: string;
  progress: number;
  uploadedBytes: number;
  size: number;
  message?: string; // For pending, completed, failed
}
