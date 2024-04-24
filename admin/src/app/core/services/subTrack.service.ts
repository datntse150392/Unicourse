import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackStep, TrackStepCreate } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment.development';
@Injectable({ providedIn: 'root' })
export class TrackStepService {
    constructor(private httpClient: HttpClient) {}

    // Thêm track step vào track
    addTrackStep(courseId: String, trackId: String, trackStep: TrackStepCreate): Observable<TrackStep> {
        return this.httpClient
            .post<TrackStep>(`${environment.baseUrl}/api/course/${courseId}/${trackId}/add-subtrack`, trackStep)
            .pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        // Handle the error appropriately here
        return throwError(() => new Error(error));
    }
}
