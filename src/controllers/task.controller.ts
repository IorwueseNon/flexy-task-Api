import { create } from "domain";
import { asyncHandler } from "../middlewares/asynchandler.middleware";


export const createTaskController = asyncHandler( async (req, res) => {
    const body = createTaskSchema.parse(req.body)
    res.status(200).json({
        success: true,
        message: "Task created successfully"
    })
})