import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import * as ytdl from 'ytdl-core';
@Injectable({ providedIn: 'root' })

export class YoutubeService {
  constructor(private httpClient: HttpClient) {}

  // getVideoInfo(videoId: string) {
  //   const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${this.API_KEY}&part=snippet,contentDetails`;
  //   return this.httpClient
  //       .get<any>(apiUrl)
  //       .pipe(catchError(this.handleError));
  // }

  async getVideoInfo(videoUrl: string): Promise<{ title: string, duration: number }> {
    // try {
    //   const info = await ytdl.getInfo(videoUrl);
    //   const title = info.videoDetails.title;
    //   const duration = parseInt(info.videoDetails.lengthSeconds);
    //   return { title, duration };
    // } catch (error) {
    //   console.error('Error fetching video info:', error);
    // }
    return { title: '', duration: 0 };
  }

  private handleError(error: any) {
    // Handle the error appropriately here
    return throwError(() => new Error(error));
  }
}
