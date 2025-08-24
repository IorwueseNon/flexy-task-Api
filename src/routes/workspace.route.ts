import { Router } from "express";
import { changeMemberRoleController, createWorkspaceController, getWorkspaceAnalyticsController, getWorkspaceByIdController, getWorkspaceByMembersIdController, getWorkspaceUserIsMemberController, updateWorkspaceController,  } from "../controllers/workspace.controller";

const workspaceRoute = Router();

workspaceRoute.post("/create/new",createWorkspaceController);
workspaceRoute.post("/update/:id",updateWorkspaceController);

workspaceRoute.get("/all",getWorkspaceUserIsMemberController );
workspaceRoute.get("/members/:id",getWorkspaceByMembersIdController);
workspaceRoute.put("/members/role/:id",changeMemberRoleController);
workspaceRoute.get("/analytics/:id",getWorkspaceAnalyticsController);
workspaceRoute.get("/:id",getWorkspaceByIdController);


export default workspaceRoute;