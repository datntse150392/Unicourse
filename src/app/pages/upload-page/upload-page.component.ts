import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { HeaderComponent } from '../../shared/components';
import { SharedModule } from '../../shared';
import { MessageService } from 'primeng/api';
import { CourseService } from '../../cores/services';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [HeaderComponent, SharedModule],
  providers: [MessageService],
  templateUrl: './upload-page.component.html',
  styleUrl: './upload-page.component.scss'
})
export class UploadPageComponent {
  file!: File;
  currentChunkIndex = 0;
  uploadPercent = 0;

  constructor(
    private messageService: MessageService,
    private courseService: CourseService,
  ) {}

  onFileSelect(event: any) {
    this.file = event.currentFiles[0];
    console.log(event.currentFiles[0]);
  }

  uploadFile() {
    this.courseService.uploadFile(this.file).subscribe(
      (res: any) => {
        if (res.type === HttpEventType.UploadProgress) {
          this.uploadPercent = Math.round((100 * res.loaded) / res.total);
        } else if (res.type === HttpEventType.Response) {
          this.messageService.add({ severity: 'info', summary: 'Thành công', detail: `Upload video thành công` });
        }
      },
      (error: any) => {
        this.messageService.add({ severity: 'error', summary: 'Thất bại', detail: `Upload video thất bại` });
      }
    );
  }

  // async uploadFile() {
  //   let fileId = `${this.file.name}-${this.file.lastModified}`;
  //   let headers = new HttpHeaders({
  //     size: this.file.size.toString(),
  //     "x-file-id": fileId,
  //     name: this.name,
  //   });
  //   this.http
  //     .post('http://localhost:3000/upload', this.file, { headers, reportProgress: true })
  //     .subscribe((res: any) => {
  //       if (res.type === HttpEventType.UploadProgress) {
  //         this.uploadPercent = Math.round(
  //           100 * ((res.loaded + uploadedBytes) / this.selectedFile.size)
  //         );
  //         if (this.uploadPercent >= 100) {
  //           this.name = "";
  //           this.selectedFile = null;
  //         }
  //       } else {
  //         console.log(JSON.stringify(res));
  //         if (this.uploadPercent >= 100) {
  //           this.name = "";
  //           this.selectedFile = null;
  //         }
  //       }
  //     });
  //   this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Basic Mode' });
  // }
}
