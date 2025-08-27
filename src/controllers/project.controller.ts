import e, { Request,Response,NextFunction } from "express";
import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { createProjectSchema, projectIdSchema, updateProjectSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleService } from "../services/member.service";
import { rowGuard } from "../util/roleGuard";
import { PermissionsEnum } from "../enums/role.enum";
import { createProjectService, deleteProjectService, getAllProjectsServiceInWorkspace, getProjectAnalysisService, getProjectsByIdandWorkspaceIdService, updateProjectService } from "../services/project.service";
import { HTTPSTATUS } from "../config/httpConfig";

export const createProjectController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const body = createProjectSchema.parse(req.body);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      const userId = req.user?._id;
      const { roleName} = await getMemberRoleService(userId,workspaceId)
      rowGuard(roleName,[PermissionsEnum.CREATE_PROJECT])
       
     const {project} = await createProjectService(userId,workspaceId,body) 
        res.status(201).json({message:"Project created successfully",project})

})

export const updateProjectController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      const userId = req.user?._id;
      const body = updateProjectSchema.parse(req.body);
      const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
      const projectId = projectIdSchema.parse(req.params.projectId) ;
        const { roleName} = await getMemberRoleService(userId,workspaceId)
        rowGuard(roleName,[PermissionsEnum.EDIT_PROJECT])

        const {project} = await updateProjectService(projectId,workspaceId,body)

        res.status(HTTPSTATUS.OK).json({message:"Project updated successfully",project})
})

export const deleteProjectController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id;
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId) ;
        const { roleName} = await getMemberRoleService(userId,workspaceId)
        rowGuard(roleName,[PermissionsEnum.DELETE_PROJECT])
        const {} = await deleteProjectService(projectId,workspaceId)
    res.status(HTTPSTATUS.OK).json({message:"Delete project successfully implemented"})
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
    res.status(HTTPSTATUS.OK).json({message:"Get all projects - to be implemented",projects,
        pagination:{totalProjects,totalPages,pageSize,pageNumber,skip
        }
    })
})

export const getProjectsByIdandWorkspaceIdController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId) ;
    const userId = req.user?._id;

    const { roleName} = await getMemberRoleService(userId,workspaceId)
    rowGuard(roleName,[PermissionsEnum.VIEW_ONLY])
    const {project} = await getProjectsByIdandWorkspaceIdService(projectId,workspaceId)
    res.status(HTTPSTATUS.OK).json({message:"Get project by id and workspace",project:project})


})

export const getProjectsAnalysisController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
    const projectId = projectIdSchema.parse(req.params.projectId) ;
    const userId = req.user?._id;

    const { roleName} = await getMemberRoleService(userId,workspaceId)
    rowGuard(roleName,[PermissionsEnum.VIEW_ONLY])
    const{analytics} = await getProjectAnalysisService(projectId,workspaceId)
    res.status(HTTPSTATUS.OK).json({message:"Project Analystic Retrieve Successfully",analytics})
})
