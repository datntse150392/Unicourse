export interface User {
  _id: string;
  email: string;
  fullName: string;
  profileImage: string;
  dateOfBirth: string;
  enrollCourses: [];
  role: string;
  is_comment_blocked: boolean;
  is_blocked: boolean;
  is_chat_blocked: boolean;
  profile_image: string;
  create_at: string;
  update_at: string;
  published_at: string;
}
