import { User } from './user.model';
import { Voucher } from './voucher.model';

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  CASH: 'cash',
  VNPAY: 'vnpay',
  VIETQR: 'vietqr',
  FREE: 'free',
};

export const StatusOfPayment = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  PAID: 'PAID',
};

export const TransactionType = {
  FREE_COURSE: 'free_course',
};

interface StatusOfPayment {
  PENDING: 'pending';
  SUCCESS: 'success';
  FAILED: 'failed';
  PAID: 'PAID';
}

interface ItemCheckout {
  _id: string;
  title: string;
  titleDescription: string;
  subTitle: string;
  subTitleDescription: string;
  thumbnail: string;
  amount: number;
}

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
  transactionType: string;
  is_feedback: boolean;
  updated_at: Date;
  created_at: Date;
  items_checkout: [ItemCheckout];
}
