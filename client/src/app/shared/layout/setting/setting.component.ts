import { Component } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../cores/models';
import { FooterComponent } from '../../components';
@Component({
  selector: 'app-setting',
  standalone: true,
  imports: [SharedModule, FooterComponent],
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
})
export class SettingComponent {
  Logo: string = environment.LOGO;
  user!: User;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if (localStorage !== undefined) {
      const user = localStorage.getItem('UserInfo');
      if (user !== null) {
        this.user = JSON.parse(user);
        console.log(this.user);
      }
    }
  }
}
