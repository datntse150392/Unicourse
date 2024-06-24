export interface FeedbackModel {
  _id: string;
  content: string;
  rating: number;
  course_id: {
    _id: string;
    title: string;
  };
  user_id: {
    _id: string;
    email: string;
    fullName: string;
    profile_image: string;
    created_at: string;
    updated_at: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
  __v: number;
  transaction_id: string;
}
