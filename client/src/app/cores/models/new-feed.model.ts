import { User } from './user.model';

export interface NewFeed {
  _id: string;
  title: string;
  description: string;
  image: string;
  footer: string;
  author: User;
  post_date: Date;
  status: string;
  flag: string;
}
