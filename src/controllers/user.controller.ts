import { NextFunction, Request,Response } from "express";
import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { get } from "http";
import { HTTPSTATUS } from "../config/httpConfig";
import { getCurrentUserService } from "../services/user.service";


export const getCurrentUserController = asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
       const userId = req.user?._id;
      const{user} = await getCurrentUserService(userId);
      res.status(HTTPSTATUS.OK).json({
        message:"Current user fetched successfully",
        user
      });
      
})