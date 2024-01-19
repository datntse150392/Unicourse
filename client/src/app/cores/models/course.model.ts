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
  tracks: [];
  semester_number: number;
}
