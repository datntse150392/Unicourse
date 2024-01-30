import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedModule } from '../../shared';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../shared/components';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent implements OnInit, OnDestroy{
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
  
}
