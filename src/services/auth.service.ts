import mongoose from "mongoose"
import UserModel from "../models/user.model"
import AccountModel from "../models/account.model"
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/role_permission.model";
import { RoleEnum } from "../enums/role.enum";
import { BadRequestException, NotFoundException } from "../util/appError";
import MemberModel from "../models/member.model";
import { AccountProviderEnum } from "../enums/account-provider.enum";

export const loginOrCreateAccountService = async (data:{
     provider: string,
     displayName: string,
     providerId: string,
     picture?:string,
     email?:string,
})=>{
    const { provider, displayName, providerId, picture, email } = data
    const session = await mongoose.startSession();
    console.log(data, "data in loginOrCreateAccountService");
    try {
         session.startTransaction();
         console.log("session started for login or create account service");
         let user = await UserModel.findOne({email}).session(session);
   if(!user){
       user  = new UserModel({
              name: displayName,
              email: email,
              profilePicture: picture,
              isActive: true,
       }) 
       await user.save({ session });
       console.log("User created successfully");
 
       const account = new AccountModel({ 
          provider: provider, 
          providerId: providerId,  
          userId: user._id,
       })
       await account.save({ session });
         console.log("Account created successfully");

       const workspace = new WorkspaceModel({
              name: `My Workspace`,
              description: `Workspace for ${user.name}`,
              owner: user._id,
       })

       await workspace.save({session})
         console.log("Workspace created successfully");

       const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER }).session(session);
       if (!ownerRole) {
           throw new NotFoundException("Owner role not found"); 
       }
       const member = new MemberModel({
              userId: user._id,
              workspaceId: workspace._id,
              role: ownerRole._id,
              joinedAt: new Date(),
       })

       await member.save({ session });
            console.log("Member created successfully");
    

       user.currentWorkspace =  workspace._id as mongoose.Types.ObjectId;
         await user.save({ session });
         await session.commitTransaction();
         session.endSession();
        console.log("User and related entities created successfully. end session");
      }
       return { user };
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }finally{
        session.endSession();
    }

   
}

export const registerUserService = async (data: { name: string; email: string; password:string; })=>{
    const { name, email, password } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        console.log("session started for registerUserService");
        let user = await UserModel.findOne({email}).session(session)
        console.log(user, "user in registerUserService");
        if(!user){
           const user = new UserModel({
            name: name,
            email: email,
            password: password,
            isActive: true,
        });
        await user.save({ session });
        console.log("User registered successfully");

          const account = new AccountModel({ 
          provider: AccountProviderEnum.EMAIL, 
          providerId: email,  
          userId: user._id,
       })
       await account.save({ session });
         console.log("Account created successfully");

        
        const workspace = new WorkspaceModel({
            name: `My Workspace`,
            description: `Workspace for ${user.name}`,
            owner: user._id,
        });

        await workspace.save({ session });
        console.log("Workspace created successfully");

       const ownerRole = await RoleModel.findOne({ name: RoleEnum.OWNER }).session(session);
       if (!ownerRole) {
           throw new NotFoundException("Owner role not found"); 
       }
         const member = new MemberModel({
              userId: user._id,
              workspaceId: workspace._id,
              role: ownerRole._id,
              joinedAt: new Date(),
       })

       await member.save({ session });
            console.log("Member created successfully");
    

        user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();
        console.log("User and workspace created successfully. end session");
        return { userId: user._id, workspaceId: workspace._id };

        }
        else{
            throw new BadRequestException("User already exists with this email");
        }


    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    } finally {
        session.endSession();
    }
}

export const verifyUserService = async ({email, password, provider = AccountProviderEnum.EMAIL}:{
    email: string;
    password: string;
    provider?: string
})=>{
          const account = await AccountModel.findOne({provider,providerId:email})
          if(!account){
            throw new NotFoundException("invalid email or password");
          }
            const user = await UserModel.findOne(account.userId)
            if(!user){
                throw new NotFoundException("User not found for this account");
            }
            const isPasswordValid = await user.comparePassword(password);
            if(!isPasswordValid){   
                throw new NotFoundException("invalid email or password");
            }
           return  user.omitPassword()
        

        }