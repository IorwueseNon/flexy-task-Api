import { asyncHandler } from "../middlewares/asynchandler.middleware";
import{Request,Response,NextFunction} from "express"
import z from "zod";
import { HTTPSTATUS } from "../config/httpConfig";
import { joinWorkspaceService } from "../services/member.service";

export const joinWorkspaceController = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const inviteCode = z.string().min(2).parse(req.params.inviteCode);
    const userId = req.user?._id;
    const { workspaceId,role}  = await joinWorkspaceService(userId, inviteCode);

    res.status(HTTPSTATUS.OK).json({
        message: "Joined workspace successfully",
        workspaceId,
        role
    })
})

