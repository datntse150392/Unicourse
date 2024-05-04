import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class SharedService {
  // Dùng để hiển thị dialog đăng nhập
  private turnOnSignIn = new BehaviorSubject<boolean>(false);
  turnOnSignIn$ = this.turnOnSignIn.asObservable();

  // Dùng để hiển thị dialog đăng ký
  private turnOnSignUp = new BehaviorSubject<boolean>(false);
  turnOnSignUp$ = this.turnOnSignUp.asObservable();

  // Dùng để gọi hàm setting localStorage khi đăng nhập
  private settingLocal = new BehaviorSubject<boolean>(false);
  settingLocal$ = this.settingLocal.asObservable();

  // Dùng để gửi thông báo khi cập nhật thông tin user
  private isUpdateUser = new BehaviorSubject<boolean>(false);
  isUpdateUser$ = this.isUpdateUser.asObservable();

  // Dùng để gửi thông báo khi cập nhật giỏ hàng
  private isUpdateCart = new BehaviorSubject<boolean>(false);
  isUpdateCart$ = this.isUpdateCart.asObservable();

  // Dùng để nhận bắt đầu nhận thông báo progress upload file
  private startUpload = new BehaviorSubject<boolean>(false);
  startUpload$ = this.startUpload.asObservable();

  // Dùng để tắt thông báo progress upload file
  private stopUpload = new BehaviorSubject<boolean>(false);
  stopUpload$ = this.stopUpload.asObservable();

  // Dùng để lưu thông tin progress upload file
  public fileStatus = new BehaviorSubject<FileStatus>({
    filename: '',
    progress: 0,
    uploadedBytes: 0,
    size: 0,
    message: '', // Status: Uploading, Uploaded, Error
  });

  // Dùng để hiển thị dialog đăng nhập
  private isRefreshTotalCoin = new BehaviorSubject<boolean>(false);
  isRefreshTotalCoin$ = this.isRefreshTotalCoin.asObservable();

  constructor() {}

  turnOnSignInDialog() {
    this.turnOnSignIn.next(true);
  }

  turnOffSignInDialog() {
    this.turnOnSignIn.next(false);
  }

  turnOnSignUpDialog() {
    this.turnOnSignUp.next(true);
  }

  turnOffSignUpDialog() {
    this.turnOnSignUp.next(false);
  }

  settingLocalStorage() {
    this.settingLocal.next(true);
  }

  isUpdateUserInfo() {
    this.isUpdateUser.next(true);
  }

  isUpdateCartItem() {
    this.isUpdateCart.next(true);
  }

  startUploadFile() {
    this.startUpload.next(true);
  }

  stopUploadFile() {
    this.stopUpload.next(true);
  }

  // Lưu thông tin progress upload file
  setFileStatus(fileStatus: FileStatus) {
    this.fileStatus.next(fileStatus);
  }

  // Lấy thông tin progress upload file
  getFileStatus() {
    return this.fileStatus.asObservable();
  }

  refreshTotalCoin() {
    this.isRefreshTotalCoin.next(true);
  }
}
