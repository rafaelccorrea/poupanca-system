import {
  Injectable,
  CallHandler,
  ExecutionContext,
  ImATeapotException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor {
  constructor(private readonly timeout: number) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.timeout),
      catchError((err) => {
        if (err instanceof ImATeapotException) {
          throw new ImATeapotException('Request timed out');
        }
        throw err;
      }),
    );
  }
}
