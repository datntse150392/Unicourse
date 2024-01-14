import { Component } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from '../../shared.module';
import { SharedService } from '../../../cores/services/shared.service';
@Component({
  selector: 'app-navigate',
  standalone: true,
  imports: [AvatarModule, SharedModule],
  templateUrl: './navigate.component.html',
  styleUrl: './navigate.component.scss',
})
export class NavigateComponent {
  constructor(private sharedService: SharedService) {}
  openDialogSignIn() {
    this.sharedService.turnOnSignInDialog();
  }
}
