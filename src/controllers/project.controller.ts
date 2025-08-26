import e, { Request,Response,NextFunction } from "express";
import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { createProjectSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleService } from "../services/member.service";
import { rowGuard } from "../util/roleGuard";
import { PermissionsEnum } from "../enums/role.enum";
import { createProjectService, getAllProjectsServiceInWorkspace } from "../services/project.service";

export const createProjectController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const body = createProjectSchema.parse(req.body);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      const userId = req.user?._id;
      const { roleName} = await getMemberRoleService(userId,workspaceId)
      rowGuard(roleName,[PermissionsEnum.CREATE_PROJECT])
       
     const {project} = await createProjectService(userId,workspaceId,body) 
        res.status(201).json({message:"Project created successfully",project})

})

export const getAllProjectsControllerInWorkspace = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const userId = req.user?._id;
    const { roleName} = await getMemberRoleService(userId,workspaceId)
    rowGuard(roleName,[PermissionsEnum.VIEW_ONLY])

   const pageSize = parseInt(req.query.pageSize as string) || 10;
   const pageNumber = parseInt(req.query.pageNumber as string) || 1;    

   const {projects,totalProjects,totalPages,skip} = await getAllProjectsServiceInWorkspace(workspaceId,pageSize,pageNumber)
    // Implement get all projects service and controller logic here
    res.status(200).json({message:"Get all projects - to be implemented"})
})