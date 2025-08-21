import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from "./app.config";
import { Request } from "express";
import { NotFoundException } from "../util/appError";
import { AccountProviderEnum } from "../enums/account-provider.enum";
import { loginOrCreateAccountService, verifyUserService } from "../services/auth.service";


passport.use(new GoogleStrategy({ 
    clientID:config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true,
},async (req:Request,accessToken,refreshToken,profile,done)=>{
     try{
        const {email, sub:googleId, picture} = profile._json
        console.log(profile,"profile")
        console.log(googleId,"googleId")
        if(!googleId){
            return new NotFoundException("Google ID not found in profile");
        }
        const result = await loginOrCreateAccountService({
            provider: AccountProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email,
        });
        if (!result || !result.user) {
            return done(new NotFoundException("User not found after login or creation"), false);
        }
        done(null, result.user);
     }catch(e){
        done(e,false)
     }
}

  )
   )
passport.serializeUser((user:any, done) => done(null, user));

passport.deserializeUser((user: any, done) => done(null, user));

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField:"password",    
        session:true
    },async (email,password,done)=>{
        try{
            const user = await verifyUserService({email,password});
            return done(null,user);

        }catch(e){
           return  done(e, false);
            
        }
    })
)