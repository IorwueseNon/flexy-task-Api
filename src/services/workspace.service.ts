import mongoose from "mongoose";
import { RoleEnum } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import UserModel from "../models/user.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException } from "../util/appError";
import RoleModel from "../models/role_permission.model";
import TaskModel from "../models/task.model";
import { TaskStatusEnum } from "../enums/task.enum";

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
        ...workspace.toObject(),
        members
     }

        return {workspace:workspaceWithMembers};


} 

export const getWorkspaceMember = async (workspaceId:string)=>{
    
    const members = await MemberModel.find({workspaceId}).populate("userId","name email profilePicture -password").populate("role","name");
    const roles = await RoleModel.find({},{name:1,_id:1}).select("-permissions").lean();

    return {members,roles}
}

export const getWorkspaceAnalyticsService = async (workspaceId:string)=>{
    const currentDate = new Date();
    const totalTask = await TaskModel.countDocuments({workspace:workspaceId});
    const overdueTask= await TaskModel.countDocuments({workspace:workspaceId,
        dueDate:{$lt:currentDate},
        status:{$ne:TaskStatusEnum.DONE}
    })
    const completedTask = await TaskModel.countDocuments({workspace:workspaceId,
        status:{$ne:TaskStatusEnum.DONE}
    })
    const analytics = {
        totalTask,
        overdueTask,
        completedTask
    }
    return {analytics};
}

export const changeMemberRoleService = async (workspaceId:string,memberId:string,roleId:string)=>{
  const role = await RoleModel.findById(roleId);
  if(!workspaceId){
    throw new NotFoundException("Workspace ID is required");
  }
  if (!role) {
    throw new NotFoundException("Role not found");
  }

  const member = await MemberModel.findOne({userId:memberId,workspaceId:workspaceId})
if(!member){
    throw new NotFoundException("Member not found in this workspace");
}

member.role = role
await member.save();

return {member}
}