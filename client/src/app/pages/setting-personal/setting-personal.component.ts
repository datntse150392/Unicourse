import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
@Component({
  selector: 'app-setting-personal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './setting-personal.component.html',
  styleUrl: './setting-personal.component.scss',
})
export class SettingPersonalComponent {}
