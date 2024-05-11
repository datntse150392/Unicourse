import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Quiz, UserQuiz } from '../models';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Filter {
    title: String | undefined;
    newest: Boolean | undefined;
    topView: Boolean | undefined;
    category: String | undefined;
    pageNumber: number;
    limit: number;
}


interface QuizResponse {
    status: number,
    message: string,
    data: {
        quizzes: Quiz[],
        totalPages: number,
        totalRecords: number
    }
}

@Injectable({ providedIn: 'root' })
export class QuizService {
    private refreshQuiz = new BehaviorSubject<boolean>(false);

    constructor(private httpClient: HttpClient) { }

    // Lấy danh sách quiz của flashcard
    getQuiz(userId: any, filter: Filter): Observable<QuizResponse> {
        let baseUrl = environment.baseUrl + `/api/quiz/pagination/title?`;

        // Implement logic attribute filter !== undefined thì thêm vào url
        if (userId) {
            baseUrl += `&userId=${userId}`;
        }
        if (filter.title) {
            baseUrl += `&title=${filter.title}`;
        }
        if (filter.newest) {
            baseUrl += `&newest=${filter.newest}`;
        }
        if (filter.topView) {
            baseUrl += `&topView=${filter.topView}`;
        }
        if (filter.category) {
            baseUrl += `&category=${filter.category}`;
        }
        if (filter.pageNumber) {
            baseUrl += `&pageNumber=${filter.pageNumber}`;
        }
        if (filter.limit) {
            baseUrl += `&limit=${filter.limit}`;
        }
        
        return this.httpClient
            .get<QuizResponse>(`${baseUrl}`)
            .pipe(catchError(this.handleError));
    }

    // Lấy danh sách quiz của flashcard by id
    getQuizById(id: string): Observable<Quiz> {
        return this.httpClient
            .get<Quiz>(`${environment.baseUrl}/api/quiz/${id}`)
            .pipe(catchError(this.handleError));
    }

    // Thêm/Xóa quiz từ danh sách quiz yêu thích
    toggleFavoriteQuiz(id: string) {
        return this.httpClient
            .put<any>(`${environment.baseUrl}/api/quiz/interest/${id}`, {})
            .pipe(catchError(this.handleError));
    }

    // Lưu tiến trình của flashcard khi người dùng trả lời
    saveUserQuiz(userFlashcard: UserQuiz) {
        return this.httpClient
            .put<any>(`${environment.baseUrl}/api/quiz/edit/${userFlashcard._id}/update-progress`,
                userFlashcard,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                }
            )
            .pipe(catchError(this.handleError));
    }

    // Call api tính toán flashcard result
    calculateResult(userFlashcard: any) {
        let body = userFlashcard;
        const user_id = localStorage.getItem('user_id');
        if (user_id) {
            body.user_id = user_id;
        }
        return this.httpClient
            .post<any>(`${environment.baseUrl}/api/quiz/result/${body._id}`,
                body
            )
            .pipe(catchError(this.handleError));
    }

    // Reset quiz progress của user
    resetQuiz(quiz_id: any) {
        return this.httpClient
            .post<any>(`${environment.baseUrl}/api/quiz/edit/${quiz_id}/reset-progress`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                    },
                })
            .pipe(catchError(this.handleError));
    }

    // Update trạng thái refresh quiz
    setRefreshQuiz(value: boolean) {
        this.refreshQuiz.next(value);
    }

    // Lấy thông tin trạng thái refresh quiz
    getRefreshQuiz(): Observable<boolean> {
        return this.refreshQuiz.asObservable();
    }

    private handleError(error: any) {
        // Handle the error appropriately here
        return throwError(() => new Error(error));
    }
}
