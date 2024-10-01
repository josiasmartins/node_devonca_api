import { ErrorModel } from "../domain/model/ErrorModel";
import { NextFunction, Response, Request } from "express";
import { ApiError } from "./ApiError";

export function errorHandler(
    err: Error & Partial<ApiError>, 
    req: Request, 
    res: Response, 
    next: NextFunction) {

    if (res.headersSent) {
        return next(err);
    }

    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal Server Error";
    
    
    res.status(statusCode);
    res.json({ name: err.name, message, statusCode });
    
    // if (res.headersSent) {
    //     return next(err);
    // }

    // res.status(500);
    // res.send(new ErrorModel(
    //     err.name,
    //     500,
    //     err.message
    // ));

}