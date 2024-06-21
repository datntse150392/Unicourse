import { ErrorHandler, NgModule } from '@angular/core';
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
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SidebarModule } from 'primeng/sidebar';
import { TreeTableModule } from 'primeng/treetable';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GlobalDialogHandlerService } from '../cores/services/global-dialog.service';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SpeedDialModule } from 'primeng/speeddial';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BlockUIModule } from 'primeng/blockui';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { MegaMenuModule } from 'primeng/megamenu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { KnobModule } from 'primeng/knob';

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
    ToggleButtonModule,
    SidebarModule,
    TreeTableModule,
    AccordionModule,
    ConfirmDialogModule,
    TagModule,
    TooltipModule,
    SpeedDialModule,
    DividerModule,
    FileUploadModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    BlockUIModule,
    TieredMenuModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    TabViewModule,
    CheckboxModule,
    MegaMenuModule,
    InputSwitchModule,
    RadioButtonModule,
    FontAwesomeModule,
    KnobModule,
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
    ToggleButtonModule,
    SidebarModule,
    TreeTableModule,
    AccordionModule,
    ConfirmDialogModule,
    TagModule,
    TooltipModule,
    SpeedDialModule,
    DividerModule,
    FileUploadModule,
    ScrollTopModule,
    ProgressSpinnerModule,
    BlockUIModule,
    TieredMenuModule,
    ConfirmPopupModule,
    OverlayPanelModule,
    TabViewModule,
    CheckboxModule,
    MegaMenuModule,
    InputSwitchModule,
    RadioButtonModule,
    FontAwesomeModule,
    KnobModule,
    ImageModule,
  ],
  providers: [GlobalDialogHandlerService],
})
export class SharedModule {}
