import { NextFunction,Request,Response } from "express";
import { config } from "../config/app.config";
import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { registerUserService } from "../services/auth.service";
import { registerSchema } from "../validation/auth.validation";
import passport from "passport";
import { HTTPSTATUS } from "../config/httpConfig";


export const googleLoginCallback = async (req:Request, res: Response,) => {
    const currentWorkspace = req.user?._id;
    if (!currentWorkspace) {
        return res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failed`);
    }
    return res.redirect(`${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`);
}

export const registerUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const body = registerSchema.parse({...req.body})

    await registerUserService(body);
     res.status(HTTPSTATUS.CREATED).json({
        message: "User registered successfully",
    });
})

export const loginUserController =  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: true },
         (err:Error,
             user:Express.User, 
             info:{message:string} | undefined) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({message: info?.message || "Invalide email or password"});
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            return res.status(HTTPSTATUS.OK).json({ message: "Login successful", user });
        });
    })(req, res, next); 
});

export const logoutUserController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
       req.logOut((err)=>{
        if (err){
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ message: "Logout failed",
            });
        }
       });
       req.session.destroy((err) => {
        if (err) {
            return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ message: "Logout failed" });
        }else{
             res.clearCookie('connect.sid');
             res.status(HTTPSTATUS.OK).json({ message: "Logout successful" });
        }
    });
      
})