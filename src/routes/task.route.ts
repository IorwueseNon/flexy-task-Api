import { Router } from "express";
import { createTaskController,  deleteTaskController,  getAllTasksController,  getTasksByIdController,  updateTaskController } from "../controllers/task.controller";

const taskRoute = Router()

taskRoute.post("/project/:projectId/workspace/:workspaceId/create",createTaskController) 

taskRoute.put("/:id/project/:projectId/workspace/:workspaceId/update",updateTaskController)

taskRoute.get("/workspace/:workspaceId/all",getAllTasksController)

taskRoute.get("/:id/project/:projectId/workspace/:workspaceId",getTasksByIdController)

taskRoute.delete("/:id/workspace/:workspaceId/delete",deleteTaskController)

export default taskRoute;