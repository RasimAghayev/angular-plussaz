import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Post } from './post.shared';
import { NotificationService } from 'src/app/notification.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // Base url
  baseurl=environment.baseurl
  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    ) {}
  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  // POST
  CreatePost(data: any): Observable<Post> {
    return this.http
      .post<Post>(
        this.baseurl + '/posts/',
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // GET ID
  GetPost(id: string): Observable<Post> {
    return this.http
      .get<Post>(this.baseurl + '/posts/' + id)
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // GET ALL
  GetPosts(): Observable<Post> {
    return this.http
      .get<Post>(this.baseurl + '/posts/')
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // PUT
  UpdatePost(id: string, data: any): Observable<Post> {
    return this.http
      .put<Post>(
        this.baseurl + '/posts/' + id,
        JSON.stringify(data),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // DELETE
  DeletePost(id: string) {
    return this.http
      .delete<Post>(this.baseurl + '/posts/' + id, this.httpOptions)
      .pipe(retry(1), catchError(this.errorHandl));
  }
  // Error handling
  errorHandl(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    this.notificationService.setErrorMessage(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
