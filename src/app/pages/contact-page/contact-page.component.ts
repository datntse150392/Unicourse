import { Component } from '@angular/core';
import { SharedModule } from '../../shared';
import { HeaderComponent } from '../../shared/components';
@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.scss',
})
export class ContactPageComponent {
  openLink(link: string): void {
    window.open(`${link}`, '_blank');
  }
}
