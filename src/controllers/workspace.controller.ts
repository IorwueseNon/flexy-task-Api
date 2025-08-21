
import {Request,Response ,NextFunction } from "express";
import { HTTPSTATUS } from "../config/httpConfig";
import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { createworkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { createWorkspaceService, getWorkspaceByIdService, getWorkspaceUserIsMemberService } from "../services/workspace.service";
import { getMemberRoleService } from "../services/member.service";

export const createWorkspaceController = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const body = createworkspaceSchema.parse(req.body);
    const userId = req.user?._id
    const workspace = await createWorkspaceService(userId, body);

     res.status(HTTPSTATUS.CREATED).json({
        message: "Workspace created successfully",
        workspace
    })

})

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
    const workspace = await getWorkspaceByIdService(workspaceId);
})