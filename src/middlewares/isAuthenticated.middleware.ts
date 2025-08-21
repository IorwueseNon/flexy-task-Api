import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../util/appError";

const isAuthenticated = async(req:Request,res:Response,next:NextFunction)=>{
     if(!req.user || !req.user?._id){
        throw new UnauthorizedException("Unauthorise Please login ")
     }
     next()
}

export default isAuthenticated