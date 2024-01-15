import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterComponent, HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { SharedService } from '../../cores/services/shared.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, SharedModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  value = 5;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
