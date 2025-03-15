import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from "@angular/router";
import {catchError, Observable, of, throwError} from "rxjs";
import {StorageService} from "./storage.service";
import { LoaderService } from './loader.service';

@Injectable()
export class ApiHttpService {
  constructor(
    private http: HttpClient, private router: Router, private storageService: StorageService,private loaderService: LoaderService
  ) {

  }

  public get(url: string, options?: any): Observable<any> {
    return this.http.get(url, options).pipe(catchError(this.handleError()));
  }

  public post(url: string, data: any, options?: any): Observable<any> {
    return this.http.post(url, data, options).pipe(catchError(this.handleError()));
  }

  public put(url: string, data: any, options?: any): Observable<any> {
    return this.http.put(url, data, options).pipe(catchError(this.handleError()));
  }

  public delete(url: string, options?: any): Observable<any> {
    return this.http.delete(url, options).pipe(catchError(this.handleError()));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.log("--------^^^^^^^^^-", error)
      if (error.status == 401) {
        this.storageService.clean()
        this.router.navigate(['/auth/login']).then(() => {
          window.location.reload();
           
        });
      }


      // TODO: send the error to remote logging infrastructure
      // console.error("Error: --->",error); // log to console instead
      // this.storageService.clean()
      // this.router.navigate(['/']);
      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      result = error?.error
      // return throwError(() => error);
      // Let the app keep running by returning an empty result.
      console.log("-1-1-1--1--1----->", result)
      return of(result as T);
      // return result;
    };
  }
}
