import { Router } from "express";

const taskRoute = Router()

taskRoute.post(":projectId/workspace/:workspaceId/create",createTaskController) 

export default taskRoute;