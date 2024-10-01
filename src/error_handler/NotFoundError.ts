import { ApiError } from "./ApiError";

export class NotFound extends ApiError {

    constructor(message: string) {
        super(message, 404)
    }

}