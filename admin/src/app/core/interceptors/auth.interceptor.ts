import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log(`Request is on its way to ${request.url}`);
        const token = localStorage && localStorage.getItem('access_token');
        // If a token exists in localStorage, add it to the Authorization header
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`, // Fix the quotes here
            },
        });
        return next.handle(request);
    }
}
