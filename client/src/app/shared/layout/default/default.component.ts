import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent, HeaderComponent } from '../../components';

@Component({
  selector: 'app-default',
  standalone: true,
  imports: [RouterModule, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent {}
