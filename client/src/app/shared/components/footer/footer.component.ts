import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  public Logo = environment.LOGO;
}
