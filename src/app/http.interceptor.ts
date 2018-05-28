import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpErrorResponse,
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class HttpLogInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jsforce0_access_token');

    const customHeaderRequest = request.clone({
      headers: request.headers
        .append('Access-Control-Allow-Origin', 'http://localhost:4200')
        .append('Authorization', 'Bearer ' + token)
    });

    return next.handle(customHeaderRequest)

      .catch((err: HttpErrorResponse) => {
        if (err.status === 200) {
          const res = new HttpResponse({
            body: err.status,
            headers: err.headers,
            status: err.status,
            statusText: err.statusText,
            url: err.url
          });
          return Observable.of(res);
        } else {
          return Observable.throw(err);
        }
      });
  }
}
