import { asyncHandler } from "../middlewares/asynchandler.middleware";
import { createTaskSchema, updateTaskSchema } from "../validation/task.validation";
import { projectIdSchema } from "../validation/project.validation";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleService } from "../services/member.service";
import { rowGuard } from "../util/roleGuard";
import { PermissionsEnum } from "../enums/role.enum";
import { createTaskService, deleteTaskService, getAllTasksService, getTaskByIdService, updateTaskService } from "../services/task.service";
import { HTTPSTATUS } from "../config/httpConfig";
import e from "express";


export const createTaskController = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const body = createTaskSchema.parse(req.body)
    const projectId = projectIdSchema.parse(req.params.projectId)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)

    const { roleName } = await getMemberRoleService(userId, workspaceId)
    rowGuard(roleName, [PermissionsEnum.CREATE_TASK])

    const { task } = await createTaskService(workspaceId, projectId, userId, body)
    res.status(200).json({
        success: true,
        message: "Task created successfully",
        task
    })
})

export const updateTaskController = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const body = updateTaskSchema.parse(req.body)
    const projectId = projectIdSchema.parse(req.params.projectId)
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const taskId = req.params.id

    const { roleName } = await getMemberRoleService(userId, workspaceId)
    rowGuard(roleName, [PermissionsEnum.EDIT_TASK])

    const { updateTask } = await updateTaskService(workspaceId, projectId, taskId, body)
    res.status(200).json({
        success: true,
        message: "Task updated successfully",
        updateTask

    })
})

export const getAllTasksController = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const filter ={
        projectId: req.query.projectId? (req.query.projectId as string) :undefined,
        status: req.query.status? (req.query.status as string )?.split(","):undefined,
        priority: req.query.priority? (req.query.priority as string)?.split(","):undefined,
        assignedTo: req.query.assignedTo ? (req.query.assignedTo as string)?.split(","):undefined,
        keyword: req.query.keyword as string | undefined,
        dueDate: req.query.dueDate as string | undefined
    }

    const pagination = {
        pageSize:parseInt(req.query.pageSize as string) || 10,
        pageNumber:parseInt(req.query.page as string) || 1,
    }

    const { roleName } = await getMemberRoleService(userId, workspaceId)
    rowGuard(roleName, [PermissionsEnum.VIEW_ONLY])

    const result = await  getAllTasksService(workspaceId, filter, pagination)

    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Tasks fetched successfully",
        ...result
    })
})

export const getTasksByIdController = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const projectId = projectIdSchema.parse(req.params.projectId)
    const taskId = req.params.id

    const { roleName } = await getMemberRoleService(userId, workspaceId)
    rowGuard(roleName, [PermissionsEnum.VIEW_ONLY])

    const { task } = await getTaskByIdService(workspaceId, projectId, taskId)

    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Task fetched successfully",
        task
    })
})

export const deleteTaskController = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId)
    const taskId = req.params.id

    const { roleName } = await getMemberRoleService(userId, workspaceId)
    rowGuard(roleName, [PermissionsEnum.DELETE_TASK])

    await deleteTaskService(workspaceId, taskId)

    res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Task deleted successfully"
    })
})