import mongoose from "mongoose";
import { RoleEnum } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../util/appError";
import RoleModel from "../models/role_permission.model";

export const createWorkspaceService = async (userId: string, body:{name:string,description?:string | undefined}) => {
    const { name, description } = body;
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new NotFoundException("User not found");
    }
    const workspace =  new WorkspaceModel({
        name:name,
        description: description,
        owner: userId,
    })
    const role = await RoleModel.findOne({ name: RoleEnum.OWNER});
    await workspace.save();

    const member = new MemberModel({
        userId: userId,
        workspaceId: workspace._id,
        role: role?._id,
        joinedAt: new Date()
    })
    await member.save();

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    
    await user.save();

    return {workspace}




}

export const getWorkspaceUserIsMemberService = async (userId: string) => {
      const memberShips = await MemberModel.find({userId}).populate("workspaceId")
      .select("-password")
      .exec();

      const workspace = memberShips.map((memberShip)=> memberShip.workspaceId);
      return {workspace}

}

export const getWorkspaceByIdService = async (workspaceId: string) => {
     const workspace = await WorkspaceModel.findById(workspaceId)
     if (!workspace) {
         throw new NotFoundException("Workspace not found");
     }
     const members = await MemberModel.find({ workspaceId: workspace._id }).populate("role")

     const workspaceWithMembers = {
        
     }




} 