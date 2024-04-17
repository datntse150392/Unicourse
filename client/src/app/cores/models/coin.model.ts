export interface Coin {
  _id: string;
  title: string;
  description: string;
  coin: number;
  is_used: boolean;
  date_used: Date;
  status: string;
  updated_at: Date;
  created_at: Date;
}
