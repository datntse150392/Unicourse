import { User } from './user.model';
import { Voucher } from './voucher.model';

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  CASH: 'cash',
  VNPAY: 'vnpay',
  VIETQR: 'vietqr',
};

export const StatusOfPayment = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
};

export interface Transaction {
  _id: string;
  userId: User;
  process_date: Date;
  payer: Object;
  payment_method: string;
  total_old_amount: number;
  total_new_amount: number;
  voucher_id: Voucher;
  status: string;
  transaction_code: string;
  updated_at: Date;
  created_at: Date;
}
