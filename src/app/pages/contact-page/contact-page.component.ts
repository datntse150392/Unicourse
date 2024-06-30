import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ContactPageComponent {
  constructor() {}

  ngOnInIt() {
    // Định nghĩa custom element cho lord-icon
    defineElement(lottie.loadAnimation);
  }

  openLink(link: string): void {
    window.open(`${link}`, '_blank');
  }
}
