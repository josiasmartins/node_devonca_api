// import { NextFunction, Response, Request } from "express";
// import { ErrorModel } from "../domain/model/ErrorModel";

import { ApiError } from "./ApiError";

// export function badRequestHandler(error: Error, req: Request, res: Response, next: NextFunction) {

//     res.status(400);
//     res.send(new ErrorModel(
//         error.name,
//         400,
//         error.message
//     ));

// }

export class BadRequestError extends ApiError {

    constructor(message: string) {
        super(message, 400);
    }

}