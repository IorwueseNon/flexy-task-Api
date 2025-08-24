import sessions from "express-session";
import express from "express"
import { config } from "./config/app.config";
import cors from "cors";
import connectToDatabase from "./config/database.config";
import { error_handler } from "./middlewares/error_handler";
import { HTTPSTATUS } from "./config/httpConfig";
import { asyncHandler } from "./middlewares/asynchandler.middleware";
import { Request, Response,NextFunction} from "express";
import { BadRequestException } from "./util/appError";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import workspaceRoute from "./routes/workspace.route";
import memberRoute from "./routes/member.route";

const BasePath = config.BASE_PATH
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(sessions({
    name:"session",
    resave: false,
    saveUninitialized: false,
    cookie:{
    maxAge: 24 * 60 * 60 * 1000,
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    
    },
    secret: config.SESSION_SECRET,
 }
  ));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
}))

app.get("/",asyncHandler(async (req:Request, res:Response,next:NextFunction) => {
   res.status(HTTPSTATUS.OK).json({message:"Welcome to Flexy Task API"})
  
}))

app.get("/inspect",asyncHandler(async (req:Request, res:Response,next:NextFunction) => {
    console.log(req);
   res.status(HTTPSTATUS.OK).json({ session: req.session, user: req.user})
  
}))


app.use(`${BasePath}/auth`,authRoutes)
app.use(`${BasePath}/user`,isAuthenticated,userRoutes)
app.use(`${BasePath}/workspace`,isAuthenticated,workspaceRoute)
app.use(`${BasePath}/member`,isAuthenticated,memberRoute)

app.use(error_handler)

app.listen(config.PORT, async () => {
    await connectToDatabase();
    console.log(`Server is running on port ${config.PORT} in ${config.NODE_ENV} mode`)
})

