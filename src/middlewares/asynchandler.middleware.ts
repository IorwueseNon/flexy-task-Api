import { Request, Response, NextFunction } from "express";
type asyncHandlerType = (req:Request,res:Response,next:NextFunction) => Promise<void>;

export const asyncHandler =(controller:asyncHandlerType):asyncHandlerType => async(req:Request,res:Response,next:NextFunction)=>{
      try{
        await controller(req,res,next);
      }catch(error){
        next(error);
      }
}



