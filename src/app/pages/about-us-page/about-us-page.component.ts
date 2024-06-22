import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
@Component({
  selector: 'app-about-us-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './about-us-page.component.html',
  styleUrl: './about-us-page.component.scss',
})
export class AboutUsPageComponent {}
