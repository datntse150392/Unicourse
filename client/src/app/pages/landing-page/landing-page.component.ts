import { Component } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  value = 5;
}
