export interface ScheduleMeeting {
  _id: string;
  title: string;
  description: string;
  mettingCode: number;
  price: number;
  type: string;
  lecture: {
    _id: string;
    fullName: string;
  };
  status: string;
  timeStart: Date;
  timeEnd: Date;
  list_register: string[];
  hostAdmin: {
    _id: string;
    fullName: string;
  };
  created_at: Date;
  updated_at: Date;
}
