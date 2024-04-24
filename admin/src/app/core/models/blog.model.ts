import { User } from './user.model';

export interface Tag {
  name: String;
  code: String;
  color: String;
}

export interface Comment {
  _id: String;
  comment: String;
  commentator: User;
  is_removed: boolean;
  is_approved: boolean;
  created_at: Date;
  updated_at: Date;
  replies: Array<Comment>;
  interactions: Array<String>;
}
export interface Blog {
  _id: String;
  title: String;
  description: String;
  min_read: Number;
  images: Array<String>;
  date_modified: Date;
  thumbnail_url: String;
  comment_obj: Array<Comment>;
  content: String;
  tags: Array<Tag>;
  status: String;
  flag: Boolean;
  date_published: Date;
  userId: User;
  created_at: Date;
  updated_at: Date;
  like: Array<String>;
}
