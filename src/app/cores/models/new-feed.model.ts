import { User } from './user.model';

export interface NewFeed {
  _id: string;
  title: string;
  description: string;
  image: string;
  footer: string;
  author: User;
  status: string;
  flag: string;
  created_at: Date;
  updated_at: Date;
}
