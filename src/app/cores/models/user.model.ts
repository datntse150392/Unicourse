import { Coin } from './coin.model';
import { Course } from './course.model';

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
  created_at: Date;
  updated_at: Date;
  published_at: string;
  coins: Array<Coin>;
  profileName: string;
  lecture_info: LectureInfo;
  quiz_interest: Array<string>;
  quiz_process: Array<any>;
  wish_list: Array<string>;
  interests: Array<string>;
  recommended_courses: Array<Course>;
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
  feedback: Array<Feedback>;
}

export interface Feedback {
  _id: string;
  content: string;
  rating: number;
  course_id: string;
  user_id: User;
  status: string;
  created_at: Date;
  updated_at: Date;
}
