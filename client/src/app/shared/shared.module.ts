import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ImageModule } from 'primeng/image';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    BadgeModule,
    PaginatorModule,
    CarouselModule,
    RatingModule,
    AvatarModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    DialogModule,
    CardModule,
    DialogModule,
    ImageModule,
    TreeModule,
    MenuModule,
    ToastModule,
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    ButtonModule,
    BadgeModule,
    PaginatorModule,
    CarouselModule,
    RatingModule,
    AvatarModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    DialogModule,
    CardModule,
    TreeModule,
    MenuModule,
    ToastModule,
  ],
})
export class SharedModule {}
