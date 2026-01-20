import { ValidationPipe } from '@nestjs/common';

export const StrictValidationPipe = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
});
