import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { SharedModule } from '../../shared';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../../cores/models';
@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [SharedModule, EditorModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  Logo: string = environment.LOGO;
  editorContent: string = ''; // Khai báo biến editorContent
  preview: boolean = true;
  title!: string;
  user!: User;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    if (localStorage !== undefined) {
      const user = localStorage.getItem('UserInfo');
      if (user !== null) {
        this.user = JSON.parse(user);
        console.log(this.user);
      }
    }
  }

  createNewBlog() {
    console.log(this.editorContent);
  }

  togglePreview() {
    this.preview = !this.preview;
  }

  sanitizeContent(content: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
}
