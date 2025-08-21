import e, { ErrorRequestHandler } from "express"
import { HTTPSTATUS } from "../config/httpConfig";
import { AppError } from "../util/appError";
import { z,ZodError } from "zod";
import { Response } from "express";
import { ErrorCodeEnum } from "../enums/errorCode.enum";


export const formatZodError = (res:Response,err:z.ZodError) => {
   const error = err?.issues.map((e)=>({
           field:e.path.join('.'),
           message:e?.message,
        
   }))
   res.status(HTTPSTATUS.BAD_REQUEST).json({
       message: "Validation Error",
       error: error,
       errorCode:ErrorCodeEnum.VALIDATION_ERROR
   })
   

}
export const error_handler:ErrorRequestHandler = (err,req,res,next):any=>{
    console.log(`error occured in ${req.method}, ${req.path}`,err);
    if(err instanceof SyntaxError){
         return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid JSON payload",
            error: err.message
         })
    }
    if(err instanceof AppError){
        return res.status(err.statusCode || HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
            message: err.message,
            error: err.errorCode || "An unexpected error occurred"
            
        })
    }
    if(err instanceof ZodError){
        return formatZodError(res, err);  
    }
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: err.message || "An unexpected error occurred"
    })

}