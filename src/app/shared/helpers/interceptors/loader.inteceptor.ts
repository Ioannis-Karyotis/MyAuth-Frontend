import { Injectable } from '@angular/core';
import {
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '@app/shared/services';
import { catchError, delay, finalize, map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
export class LoaderInterceptor implements HttpInterceptor {

    constructor(public loaderService: LoaderService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        this.loaderService.show();
        
        return next.handle(req).pipe(
            delay(500),
            finalize(() => this.loaderService.hide())
        );
    }

}
