import { ValidationError } from "express-validator";

export interface ErrorResponse extends Error {
    statusCode: number,
    data: ValidationError[],
}

