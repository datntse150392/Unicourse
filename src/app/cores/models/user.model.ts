import { Coin } from './coin.model';

export interface User {
  _id: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  enrollCourses: EnrollCourses[];
  role: string;
  is_comment_blocked: boolean;
  is_blocked: boolean;
  is_chat_blocked: boolean;
  profile_image: string;
  create_at: string;
  update_at: string;
  published_at: string;
  class: string;
  coins: Array<Coin>;
  profileName: string;
  lecture_info: LectureInfo;
}

export interface EnrollCourses {
  _id: string;
  courseId: {
    _id: string;
    title: string;
    titleDescription: string;
    thumbnail: string;
  };
  completed: boolean;
  enrollDate: Date;
}

export interface LectureInfo {
  _id: string;
  description: string;
  my_course: Array<string>;
  my_schedule: Array<string>;
  feedback: Array<string>;
}
