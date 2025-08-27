import { Router } from "express";
import { createProjectController, deleteProjectController, getAllProjectsControllerInWorkspace, getProjectsAnalysisController, getProjectsByIdandWorkspaceIdController, updateProjectController } from "../controllers/project.controller";

const projectRoute = Router()

projectRoute.post("/workspace/:workspaceId/create",createProjectController)
projectRoute.put("/:projectId/workspace/:workspaceId/update",updateProjectController)
projectRoute.delete("/:projectId/workspace/:workspaceId/delete",deleteProjectController)

projectRoute.get("/workspace/:workspaceId/all",getAllProjectsControllerInWorkspace)
projectRoute.get("/:projectId/workspace/:workspaceId",getProjectsByIdandWorkspaceIdController)
projectRoute.get("/:projectId/workspace/:workspaceId/analytics",getProjectsAnalysisController)


export default projectRoute;