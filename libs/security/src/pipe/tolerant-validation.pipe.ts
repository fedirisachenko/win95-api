import { ValidationPipe } from '@nestjs/common';

export const TolerantValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: false,
    forbidNonWhitelisted: false,
});
