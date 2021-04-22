import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from '../models/comment';
import { AuthService } from './auth.service';
import { Country } from '../models/country';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private urlWithoutAPI = environment.baseUrl + "countries/";
  private urlWithAPI = environment.baseUrl + "api/countries/";

  comment: Comment;
  showComment: Comment = new Comment();

  constructor(private http: HttpClient, private authServ: AuthService) { }

// TODO: load only comments with enabled=true
  index(countryId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.urlWithoutAPI + countryId + "/comments")
      .pipe(
        catchError((err: any) => {
          console.log(err);
          return throwError('A problem occurred.');
        })
      );
  }

  show(cid: number) {
    return this.http.get<Comment>(this.urlWithAPI + cid, this.credentials())
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        })
      );
  }
  create(countryId: number, comment: Comment): Observable<Comment> {
    //endpoint:  api/countries/3/comments/
    comment.enabled = true;
    return this.http.post<Comment>(this.urlWithAPI + countryId + "/comments/", comment, this.credentials())
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        }
        )
      );
  }

  update(comment: Comment): Observable<Comment> {
    console.warn("** in service update(comment)\n comment.id = " + comment.id + "\ncomment.content = " + comment.content);
    console.warn("comment.country.id = " + comment.country.id);

    let requestUrl: string = this.urlWithAPI + comment.country.id + "/comments/" + comment.id;
    return this.http.put<Comment>(requestUrl, comment, this.credentials())
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        }
        )
      );
  }

  delete(countryId : number, commentId: number): Observable<Object> {
    let requestUrl = this.urlWithAPI + countryId + "/comments/" + commentId;
    return this.http.delete(requestUrl, this.credentials())
      .pipe(
        catchError((err: any) => {
          return throwError(err);
        }
        )
      );
  }


  private credentials() {
    // Make credentials
    const credentials = this.authServ.getCredentials();
    // Send credentials as Authorization header (this is spring security convention for basic auth)
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Basic ${credentials}`,
        'X-Requested-With': 'XMLHttpRequest'
      })
    }
    return httpOptions;
  }
}
