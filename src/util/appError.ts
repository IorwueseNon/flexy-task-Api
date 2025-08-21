import { HttpCode,HTTPSTATUS } from "../config/httpConfig"
import{ErrorCodeTypeEnum,ErrorCodeEnum} from  "../enums/errorCode.enum"


export class AppError extends Error {
     public statusCode:HttpCode
     public errorCode?:ErrorCodeTypeEnum 

     constructor(message: string,
        statusCode:HttpCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
        errorCode?:ErrorCodeTypeEnum ,
        

    
    ){
        super(message)
        this.statusCode = statusCode
        this.errorCode =  errorCode
        Error.captureStackTrace(this , this.constructor)
     }
     
}

export class HttpExcepton extends AppError {

    constructor(message: string, statusCode: HttpCode, errorCode?: ErrorCodeTypeEnum) {
        super(message, statusCode, errorCode);
    }
}


export class InternalServerException extends AppError{

    constructor(message = "internal server error",errorCode?:ErrorCodeTypeEnum ){
        super(message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR, 
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
        )
    }
}

export class NotFoundException extends AppError {

    constructor(message = "Resource not found", errorCode?: ErrorCodeTypeEnum) {
        super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND);
    }
}

export class BadRequestException extends AppError {

    constructor(message?:string, errorCode?: ErrorCodeTypeEnum) {
        super(message || "Bad Resquest", HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCodeEnum.VALIDATION_ERROR);
    }
}

export class UnauthorizedException extends AppError {

    constructor(message = "Unauthorized access", errorCode?: ErrorCodeTypeEnum) {
        super(message, HTTPSTATUS.UNAUTHORIZED, errorCode || ErrorCodeEnum.ACCESS_UNAUTHORISED_AUTHORISED);
    }
}