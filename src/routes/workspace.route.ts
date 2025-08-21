import { Router } from "express";
import { createWorkspaceController, getWorkspaceByIdController, getWorkspaceUserIsMemberController,  } from "../controllers/workspace.controller";

const workspaceRoute = Router();

workspaceRoute.post("/create/new",createWorkspaceController);
workspaceRoute.get("/all",getWorkspaceUserIsMemberController );
workspaceRoute.get("/:id",getWorkspaceByIdController);

export default workspaceRoute;