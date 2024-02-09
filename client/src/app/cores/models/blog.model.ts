import { User } from './user.model';

export interface Blog {
  _id: String;
  title: String;
  description: String;
  min_read: Number;
  images: Array<String>;
  date_modified: Date;
  thumbnail_url: String;
  comment_obj: Array<any>;
  content: String;
  tags: Array<String>;
  status: String;
  flag: Boolean;
  date_published: String;
  userId: User;
  created_at: Date;
  updated_at: Date;
}
