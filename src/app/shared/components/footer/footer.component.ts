import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  public Logo = environment.LOGO_FOOTER;

  constructor(private meta: Meta, private titleService: Title) {
    // Cập nhật các thẻ meta
    this.meta.addTags([
      {
        name: 'description',
        content:
          'Unicourse cung cấp các khóa học và lộ trình học tập dành riêng cho sinh viên Đại học FPT. Tìm hiểu thêm tại unicourse.vn!',
      },
      {
        name: 'keywords',
        content:
          'Unicourse, unicourse.vn, khóa học, sinh viên ĐH FPT, học tập, lộ trình, unicourse ĐH FPT',
      },
      { name: 'author', content: 'Unicourse Team' },
      { property: 'og:title', content: 'Unicourse - Khóa học ĐH FPT' },
      {
        property: 'og:description',
        content:
          'Khám phá các khóa học và lộ trình học tập tại Unicourse, dành riêng cho sinh viên ĐH FPT.',
      },
      {
        property: 'og:image',
        content:
          'https://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Baner%2FTo%CC%82%CC%89ng%20ho%CC%9B%CC%A3p%20thie%CC%82%CC%81t%20ke%CC%82%CC%81%20banner.jpg?alt=media&token=c9d4ee1a-1ecf-4fa0-a397-0a6c041bf62chttps://firebasestorage.googleapis.com/v0/b/unicourse-f4020.appspot.com/o/Baner%2F6.png?alt=media&token=1f9d38c2-782a-4578-8ccd-89386815bd0a',
      },
    ]);
  }
}
