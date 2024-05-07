export interface Quiz {
  _id: String;
  title: String;
  description: String;
  questions: Question[];
  course_id: String;
  max_attemps: Number;
  picture: String;
  viewer: Number;
  passing_score: Number;
  status: String;
  category: String;
  creator_id: Creator;
  creator_role: String;
  created_at: Date;
  date_to_now: Number;
  isQuizInterest: Boolean;
}

export interface QuizResult {
  quiz_id: String;
  user_id: String;
  score: Number;
  is_passed: Boolean;
  attempt_Number: Number;
  started_at: Date;
  completed_at: Date;
}

export interface Creator {
  _id: String,
  email: String,
  fullName: String,
  profileName: String,
  profile_image: String
}

// export interface Viewer {
//   count: Number;
//   viewer_id: String;
// }

export interface Question {
  title: String;
  type: String;
  answer: CorrectAnswer[];
  status: Boolean;
}

export interface CorrectAnswer {
  answer_text: String;
  is_correct: Boolean;
}

// Interface dành cho User -> Theo dõi tiến trình trả lời của User

export interface UserQuiz {
  _id: String;
  title: String;
  description: String;
  questions: UserQuestion[];
  course_id: String;
  max_attemps: Number;
  picture: String;
  viewer: Number;
  passing_score: Number;
  status: String;
  category: String;
  creator_id: Creator;
  creator_role: String;
  created_at: Date;
  date_to_now: Number;
  isQuizInterest: Boolean;
}

export interface UserQuestion {
  _id: String;
  title: String;
  type: String;
  answer: UserAnswer[];
  status: Boolean;
}

export interface UserAnswer {
  answer_text: String;
  is_correct: Boolean;
  is_checked: Boolean;
}