export interface TrackStep {
  _id: string;
  title: string;
  position: number;
  duration: number;
  content_url: string;
  type: string;
  platform: string;
}

export interface TrackStepCreate {
  position: number;
  video_url: string; // link full url
  content_url: string; // link video id
  type: string; // 'video' or 'document'
  platform: string; // 'youtube' or 'vimeo' or 'document'
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
  userId: string;
  tracks: Track[];
  semester_number: number;
}