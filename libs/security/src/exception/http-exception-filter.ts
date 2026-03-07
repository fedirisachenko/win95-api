import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpExceptionBodyMessage,
    HttpExceptionBody,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const message = this.extractMessage(exception.getResponse());

        response.status(status).json({ message });
    }

    extractMessage(response: unknown): HttpExceptionBodyMessage {
        if (typeof response === 'string') {
            return response;
        }

        if (typeof response === 'object' && response !== null && 'message' in response) {
            return (response as HttpExceptionBody).message;
        }

        return 'Unexpected error';
    }
}
