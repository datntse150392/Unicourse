import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared';
import { User } from '../../cores/models';
import { Subscription } from 'rxjs';
import { SharedService, UserService } from '../../cores/services';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
} from '@angular/fire/storage';
@Component({
  selector: 'app-setting-personal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './setting-personal.component.html',
  styleUrl: './setting-personal.component.scss',
  providers: [MessageService],
})
export class SettingPersonalComponent {
  public user!: User;
  public isUpdate: boolean = false;
  public newFullName: string = '';
  public newUrlImage!: string;

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {
    // Thiết lập tiêu đề cho trang
    window.document.title = 'Cài đặt tài khoản';
    // Scroll smooth lên đầu trang
    window.scroll({ top: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.initForm();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  initForm() {
    if (localStorage !== undefined) {
      this.user = JSON.parse(localStorage.getItem('UserInfo') || '');
      // Thiết lập giá trị default cho newFullName, newUrlImage
      this.newFullName = this.user.fullName;
    }
  }

  handleOnClickUpdate() {
    if (this.isUpdate === true) {
      if (this.user) {
        const Object = {
          fullName: this.newFullName,
        };
        const updateUserSubs$ = this.userService
          .updateUser(this.user._id, Object)
          .subscribe({
            next: (res: any) => {
              if (res.status === 200) {
                localStorage.setItem('UserInfo', JSON.stringify(res.data));
                this.initForm();
                // Hiển thị thông báo cập nhật thành công
                this.messageService.add({
                  severity: 'success',
                  summary: 'Thành công',
                  detail: 'Cập nhật thông tin thành công',
                });
              }
            },
          });
        this.subscriptions.push(updateUserSubs$);
      }
    }
    this.isUpdate = !this.isUpdate;
  }

  storage = inject(Storage);
  async onUpload($event: FileUploadEvent) {
    const storageRef = ref(this.storage, 'images/' + $event.files[0].name);
    const uploadTask = await uploadBytes(storageRef, $event.files[0]);
    const downloadUrl = await getDownloadURL(uploadTask.ref);
    if (this.user) {
      const Object = {
        profile_image: downloadUrl,
      };
      const updateUserSubs$ = this.userService
        .updateUser(this.user._id, Object)
        .subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              localStorage.setItem('UserInfo', JSON.stringify(res.data));
              this.initForm();
              // Hiển thị thông báo cập nhật thành công
              this.messageService.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Cập nhật thông tin thành công',
              });
              this.sharedService.isUpdateUserInfo();
            }
          },
        });
      this.subscriptions.push(updateUserSubs$);
    }
  }
}
