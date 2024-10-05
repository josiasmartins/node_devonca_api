import { ErrorModel } from "../domain/model/ErrorModel";
import { NextFunction, Response, Request } from "express";
import { ApiError } from "../error_handler/ApiError";

export function errorHandler(
    err: Error & Partial<ApiError>, 
    req: Request, 
    res: Response, 
    next: NextFunction) {

    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    
    res.status(statusCode);
    res.json({ name: err.name, message, statusCode, trace: err.stack });

    console.error(`[ERROR_HANDLER] - CALL ERROR_HANDLER: ${JSON.stringify({ 
        name: err.name, 
        message, 
        statusCode })}`);

}
