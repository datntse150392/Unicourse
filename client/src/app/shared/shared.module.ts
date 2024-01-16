import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { PaginatorModule } from 'primeng/paginator';
import { CarouselModule } from 'primeng/carousel';
import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { TreeModule } from 'primeng/tree';

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
    CardModule,
    DialogModule,
    ImageModule,
    TreeModule,
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
    CardModule,
    DialogModule,
    ImageModule,
    TreeModule,
  ],
})
export class SharedModule {}
