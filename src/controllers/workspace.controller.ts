
import e, {Request,Response ,NextFunction } from "express";
import { HTTPSTATUS } from "../config/httpConfig";
import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { changeRoleSchema, createworkspaceSchema, updateWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { changeMemberRoleService, createWorkspaceService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMember, getWorkspaceUserIsMemberService } from "../services/workspace.service";
import { getMemberRoleService } from "../services/member.service";
import { PermissionsEnum } from "../enums/role.enum";
import { rowGuard } from "../util/roleGuard";

export const createWorkspaceController = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const body = createworkspaceSchema.parse(req.body);
    const userId = req.user?._id
    const workspace = await createWorkspaceService(userId, body);

     res.status(HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace
    })

})

export const updateWorkspaceController = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const workspaceId= workspaceIdSchema.parse(req.params.id);
    const {name, description} = updateWorkspaceSchema.parse(req.body);
    const userId = req.user?._id;

    const {roleName} = await getMemberRoleService(userId, workspaceId);
    rowGuard(roleName,[PermissionsEnum.EDIT_WORKSPACE]);

    const {workspace} = await updateWorkspaceService(workspaceId,name,description);

     res.status(HTTPSTATUS.OK).json({
        message: "Workspace updated successfully",
        workspace
    })
}
)

export const getWorkspaceUserIsMemberController = asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{
     const userId = req.user?._id;
     const{workspace} = await getWorkspaceUserIsMemberService(userId);

     res.status(HTTPSTATUS.OK).json({
        message:"User's workspaces fetched successfully",
        workspace
     });
})

export const getWorkspaceByIdController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId= workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    await getMemberRoleService(userId, workspaceId);
    const {workspace} = await getWorkspaceByIdService(workspaceId);

    res.status(HTTPSTATUS.OK).json({
        message: "Workspace fetched successfully",
        workspace
    });
})

export const getWorkspaceByMembersIdController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

     const {roleName} = await getMemberRoleService(userId, workspaceId);

     rowGuard(roleName,[PermissionsEnum.VIEW_ONLY])

    const {members,roles} = await getWorkspaceMember(workspaceId);

    res.status(HTTPSTATUS.OK).json({
        message: "Workspace members fetched successfully",
        members,roles
    });
})

export const getWorkspaceAnalyticsController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId= workspaceIdSchema.parse(req.params.id);
    const userId = req.user?._id;

    const {roleName} = await getMemberRoleService(userId, workspaceId);
    rowGuard(roleName,[PermissionsEnum.VIEW_ONLY]);
    const {analytics} = await getWorkspaceAnalyticsService(workspaceId);

    res.status(HTTPSTATUS.OK).json({
        message: "Workspace analytics fetched successfully",
        analytics
    });
})

export const changeMemberRoleController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId= workspaceIdSchema.parse(req.params.id);
    const {memberId,roleId} = changeRoleSchema.parse(req.body);
    const userId = req.user?._id;

    const {roleName} = await getMemberRoleService(userId, workspaceId);
    rowGuard(roleName,[PermissionsEnum.CHANGE_MEMBER_ROLE]);

    // Implementation for changing member role goes here
    const { member } = await changeMemberRoleService(workspaceId, memberId, roleId);
    res.status(HTTPSTATUS.OK).json({
        message: "Member role changed successfully",
        // Include any relevant data here
    });


})

export const changeWorkspaceMemberRoleController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId= workspaceIdSchema.parse(req.params.id);
   
    });