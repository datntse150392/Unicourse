import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course } from '../models';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment.development';
@Injectable({ providedIn: 'root' })
export class SharedService {
    constructor(private httpClient: HttpClient) {}

    // Lấy thông tin UserInfo trên localStorage
    getUserInfo(): any {
        if (localStorage && localStorage.getItem('UserInfo') !== null) {
            return JSON.parse(localStorage.getItem('UserInfo'));
        }
        return null;
    }
    private handleError(error: any) {
        // Handle the error appropriately here
        return throwError(() => new Error(error));
    }
}
