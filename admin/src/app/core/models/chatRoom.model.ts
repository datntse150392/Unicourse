import { User } from './user.model';

export interface Message {
  _id: string;
  user: User;
  message: string;
  status: string;
  date: Date;
}

export interface ChatRoom {
  _id: string;
  name: string;
  statis: string;
  users: Array<User>;
  thumbnail: string;
  messages: Array<Message>;
  created_at: Date;
  updated_at: Date;
}
