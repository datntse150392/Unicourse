import { Subject } from "rxjs";

export interface Dialog {
  header: string;
  message: string;
  type: string;
  display: boolean;
}

export interface ConfirmDialog {
  header: String;
  message: String;
  type: String;
  return: boolean;
  numberBtn: number;
}