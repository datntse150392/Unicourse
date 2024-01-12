import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DetailComponent } from '../client/pages';

@NgModule({
  declarations: [
    // HeaderComponent, FooterComponent, SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [CommonModule, RouterModule, HttpClientModule]
})
export class SharedModule { }
