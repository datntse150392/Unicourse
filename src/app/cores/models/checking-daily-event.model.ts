export interface CheckingDailyEvent {
  _id: string;
  titlle: string;
  description: string;
  day: Date;
  is_expired: boolean;
  coin: number;
  list_users: string[];
  created_at: Date;
  updated_at: Date;
}
