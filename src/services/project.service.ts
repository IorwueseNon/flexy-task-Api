import mongoose from "mongoose"
import ProjectModel from "../models/project.model"
import TaskModel from "../models/task.model"
import { NotFoundException } from "../util/appError"
import { TaskStatusEnum } from "../enums/task.enum"

export const createProjectService = async (
    userId: string, workspaceId: string, body: { emoji?: string, name: string, description?: string }) => {
    const project = new ProjectModel({
        ...(body.emoji && { emoji: body.emoji }),
        name: body.name,
        description: body.description,
        workspaceId: workspaceId,
        createdBy: userId

    })

    await project.save()
    return { project }
}
export const updateProjectService = async (
    projectId: string, workspaceId: string, body: { emoji?: string, name?: string, description?: string }) => {
    const { emoji, description, name } = body
    const project = await ProjectModel.findOne({ _id: projectId, workspaceId: workspaceId })
    if (!project) {
        throw new NotFoundException("Project not found")
    }
    if (emoji !== undefined) project.emoji = emoji
    if (description !== undefined) project.description = description
    if (name !== undefined) project.name = name
    await project.save()

    return { project }
}

export const deleteProjectService = async (projectId: string, workspaceId: string) => {
    const project = await ProjectModel.findOne({ _id: projectId, workspaceId: workspaceId })
    if (!project) {
        throw new NotFoundException("Project not found")
    }
    await TaskModel.deleteMany({ projectId: project._id })
    await project.deleteOne()

    return {project}
}

export const getAllProjectsServiceInWorkspace = async (
    workspaceId: string, pageSize: number, pageNumber: number) => {
    const totalProjects = await ProjectModel.countDocuments({ workspaceId: workspaceId })
    const skip = (pageNumber - 1) * pageSize;
    const projects = await ProjectModel.find({ workspaceId }).skip(skip)
        .limit(pageSize)
        .populate("createdBy", "_id name profilePicture -password")
        .sort({ createdAt: -1 })



    const totalPages = Math.ceil(totalProjects / pageSize)

    return { projects, totalProjects, totalPages, skip }
}

export const getProjectsByIdandWorkspaceIdService = async (projectId: string, workspaceId: string) => {
    const project = await ProjectModel.findOne({ _id: projectId, workspaceId: workspaceId }).select("_id emoji name description")
    if (!project) {
        throw new NotFoundException("Project not found")
    }
    return { project }
}

export const getProjectAnalysisService = async (projectId: string, workspaceId: string) => {
    const project = await ProjectModel.findById(projectId)

    const currentDate = new Date();

    if (!project || project.workspaceId.toString() !== workspaceId.toString()) {
        throw new NotFoundException("Project not found or does not belong to the workspace")
    }

    const taskAnalytics = await TaskModel.aggregate([
        {
            $match: { projectId: new mongoose.Types.ObjectId(project._id) },
        }, {
            $facet: {
                totalTasks: [{ $count: "count" }],
                overdueTasks: [
                    {
                        $match: {
                            dueDate: { $lt: currentDate },
                            status: { $ne: TaskStatusEnum.DONE }
                        }
                    },
                    { $count: "count" }
                ],
                completedTasks: [{ $match: { status: TaskStatusEnum.DONE } }, { $count: "count" }],

            }
        }

    ])
    const _analytics = taskAnalytics[0] || {}
    const analytics = {
        totalTasks: _analytics.totalTasks[0]?.count || 0,
        overdueTasks: _analytics.overdueTasks[0]?.count || 0,
        completedTasks: _analytics.completedTasks[0]?.count || 0,
    }
    return {
        analytics
    }
}