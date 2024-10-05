import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Meta, Title } from '@angular/platform-browser';
import { LOGO_FOOTER } from '../../../../assets/logo';
import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FooterComponent {
  public LOGO_FOOTER = LOGO_FOOTER;

  ngOnInit() {
    // Kiểm tra xem window và customElements có tồn tại hay không
    if (typeof window !== 'undefined' && 'customElements' in window) {
      // Định nghĩa custom element cho lord-icon
      defineElement(lottie.loadAnimation);
    } else {
      console.warn('Custom Elements are not supported in this environment.');
    }
  }
}
