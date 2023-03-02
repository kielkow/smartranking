import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log({
      context: {
        type: context.getType(),
        class: context.getClass(),
        handler: context.getHandler(),
        requestData: {
          date: new Date().toISOString(),
          method: context.getArgByIndex(0)['method'],
          originalUrl: context.getArgByIndex(0)['originalUrl'],
          url: context.getArgByIndex(0)['url'],
          body: JSON.stringify(context.getArgByIndex(0)['body']),
          params: JSON.stringify(context.getArgByIndex(0)['params']),
          query: JSON.stringify(context.getArgByIndex(0)['query']),
        },
      },
    });

    return next.handle().pipe(
      tap((value) =>
        console.log({
          responseData: {
            date: new Date().toISOString(),
            success: true,
            body: JSON.stringify(value),
          },
        }),
      ),
    );
  }
}
