interface TrackStep {
  title: string;
  src: string;
  position: number;
  duration: number;
  image_url: string;
  video_url: string;
}

interface Track {
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
  quiz: null;
  createAt: Date;
  userId: string;
  tracks: Track[];
  semester_number: number;
}
