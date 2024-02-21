export interface Voucher {
  _id: string;
  code: string;
  title: string;
  discount_amount: number;
  type: string;
  remaining_uses: number;
  valid_from: Date;
  valid_to: Date;
  image: string;
}
