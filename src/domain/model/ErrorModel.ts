export class ErrorModel {

    message: string;
    statusCode: number;
    description: string

    constructor(
        message: string, 
        statusCode: number, 
        description: string
    ) {
        this.message = message;
        this.statusCode = statusCode;
        this.description = description;
    }

}