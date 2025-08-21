import { ErrorCodeEnum } from "../enums/errorCode.enum";
import MemberModel from "../models/member.model";
import WorkspaceModel from "../models/workspace.model";
import { NotFoundException, UnauthorizedException } from "../util/appError";



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