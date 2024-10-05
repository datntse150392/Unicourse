import { Component, EventEmitter, Output } from '@angular/core';
import { SharedModule } from '../../../../shared';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.scss'
})
export class AccountSettingsComponent {
  @Output() changeTab = new EventEmitter<string>();
  currentTab: string = 'danger-zone';

  handleChangeTab(tab: string) {
    this.currentTab = tab;
    this.changeTab.emit(tab);
  }

  isActive(tab: string): boolean {
    return this.currentTab === tab;
  }
}
