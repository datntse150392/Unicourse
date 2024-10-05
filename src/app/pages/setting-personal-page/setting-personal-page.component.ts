import { Component, NgZone } from '@angular/core';
import { SharedModule } from '../../shared';
import { DangerZoneComponent } from './components/danger-zone/danger-zone.component';
import { AccountSettingsComponent } from './components/account-settings/account-settings.component';
import { MessageService } from 'primeng/api';
import { SETTING } from './constants';
import { FooterComponent } from '../../shared/components';

@Component({
  selector: 'app-setting-personal-page',
  standalone: true,
  imports: [SharedModule, DangerZoneComponent, AccountSettingsComponent, FooterComponent],
  templateUrl: './setting-personal-page.component.html',
  styleUrl: './setting-personal-page.component.scss',
  providers: [MessageService],
})
export class SettingPersonalPageComponent {
  public visible: boolean = false;
  public settingTab: string = SETTING.DANGER_ZONE;

  constructor(
    private ngZone: NgZone,
    private messageService: MessageService // Inject MessageService for toast notifications
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}

  // BEHAVIOR LOGIC ZONE
  handleChangeTab(tab: string) {
    this.settingTab = tab;
  }
}
