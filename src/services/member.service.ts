import { ErrorCodeEnum } from "../enums/errorCode.enum";
import { RoleEnum } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/role_permission.model";
import WorkspaceModel from "../models/workspace.model";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../util/appError";



export const getMemberRoleService = async (userId:string, workspaceId:string)=>{
     const workspace = await WorkspaceModel.findById(workspaceId);
        if(!workspace){
            throw new NotFoundException("Workspace not found");
        }
        const member = await MemberModel.findOne({userId, workspaceId}).populate("role");
        if(!member){
            throw new UnauthorizedException("You are not a member of this workspace",ErrorCodeEnum.ACCESS_UNAUTHORISED_AUTHORISED);
        }

        const roleName = member.role.name;
        return {roleName};

    
}

export const joinWorkspaceService = async (userId:string, inviteCode:string)=>{
    const workspace = await WorkspaceModel.findOne({inviteCode:inviteCode});
    if(!workspace){
        throw new NotFoundException("Invalid invite code or workspace does not exist");
    }
    const existingMember = await MemberModel.findOne({userId:userId, workspaceId:workspace._id}).exec();
    if(existingMember){
        throw new BadRequestException("You are already a member of this workspace",ErrorCodeEnum.ACCESS_UNAUTHORISED_AUTHORISED);
    }
    const role = await RoleModel.findOne({name:RoleEnum.MEMBER});
    if(!role){
        throw new NotFoundException("Default role not found");
    }
    const newMember = new MemberModel({
        userId:userId,
        workspaceId:workspace._id,
        role:role._id,
        joinedAt:new Date()
    });

    await newMember.save();
    return { workspaceId:workspace._id,role:role.name}
}