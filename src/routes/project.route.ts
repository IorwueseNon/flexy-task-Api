import { Router } from "express";
import { createProjectController, getAllProjectsControllerInWorkspace } from "../controllers/project.controller";
import { get } from "http";

const projectRoute = Router()

projectRoute.post("/workspace/:workspaceId/create",createProjectController)
projectRoute.get("/workspace/:workspaceId/all",getAllProjectsControllerInWorkspace)

export default projectRoute;