import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum"
import MemberModel from "../models/member.model"
import ProjectModel from "../models/project.model"
import TaskModel from "../models/task.model"
import { BadRequestException, NotFoundException } from "../util/appError"

export const createTaskService = async (
    workspaceId:string,
    projectId:string,
    userId:string,
    body:{
        title:string,
        description?:string,
        priority:string,
        status:string,
        assignedTo?:string | null,
        dueDate?:string
    }) => {
      const {title,description,priority,status,assignedTo, dueDate} = body

      const project = await ProjectModel.findById(projectId)
      if(!project || project.workspaceId.toString() !== workspaceId){
        throw new NotFoundException("Project not found in the workspace")
      }
      if(assignedTo){
         const isMember = await MemberModel.exists({workspaceId, userId:assignedTo})
         if(!isMember){
            throw new NotFoundException("Assigned user is not a member of the workspace")
         }
      }
      const task = new TaskModel({
        title,
        description,
        project:projectId,
        workspace:workspaceId,
        status: status || TaskStatusEnum.TODO,
        priority: priority || TaskPriorityEnum.MEDIUM,
        assignedTo: assignedTo,
        dueDate,
        createdBy: userId
      })
      await task.save()
      return {task}
}

export const updateTaskService = async (
    workspaceId:string,
    projectId:string,
    taskId:string,
    body:{
        title?:string,
        description?:string,
        priority?:string,
        status?:string,
        assignedTo?:string | null,
        dueDate?:string
    }) => {
      const {title,description,priority,status,assignedTo, dueDate} = body

      const project = await ProjectModel.findById(projectId)
       if(!project || project.workspaceId.toString() !== workspaceId){
        throw new NotFoundException("Project not found in the workspace")
      }
      if(assignedTo){
         const isMember = await MemberModel.exists({workspaceId, userId:assignedTo})
         if(!isMember){
            throw new NotFoundException("Assigned user is not a member of the workspace")
         }
      }

      const task = await TaskModel.findById(taskId)
      if(!task || task.project.toString() !== projectId){
        throw new NotFoundException("Task not found in the project")
      }
      const updateTask = await TaskModel.findByIdAndUpdate(taskId,{...body},{new:true})
      if(!updateTask){
        throw new BadRequestException("Failed to update task")
      }
      return {updateTask}
    }

export const getAllTasksService = async (
  workspaceId:string,
  filter:{
    projectId?:string
    status?:string[],
    priority?:string[],
    assignedTo?:string[],
    dueDate?:string
    keyword?:string,
    
  },
  pagination:{
    pageSize:number,
    pageNumber:number
  }) =>{
    const query:Record<string, any> = {workspace:workspaceId}

    if(filter.projectId){
      query.project = filter.projectId
    }
    if(filter.status && filter.status?.length > 0){
      query.status = {$in: filter.status}
    }
    if(filter.priority && filter.priority?.length > 0){
      query.priority = {$in: filter.priority}
    }
    if(filter.assignedTo && filter.assignedTo?.length > 0){
      query.assignedTo = {$in: filter.assignedTo}
    }

    if(filter.keyword && filter.keyword !== undefined){
      query.title = { $regex: filter.keyword, $options: 'i' }
    }
    if(filter.dueDate && filter.dueDate?.length === 2){
        query.dueDate = {$eq:new Date(filter.dueDate)}
    }
    const{pageSize,pageNumber} = pagination
    const skip = (pageNumber - 1) * pageSize;

    const [task,totalCount] = await Promise.all([
    TaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .populate("createdBy", "_id name profilePicture -password")
      .populate("assignedTo", "_id name"),
      
    TaskModel.countDocuments(query)
    ])

    const totalPages = Math.ceil(totalCount / pageSize)

    return {
      task,
      pagination:{
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip
      }
     }

}

export const getTaskByIdService = async (
  workspaceId:string,
  projectId:string,
  taskId:string
) =>{
    const project = await ProjectModel.findById(projectId)
    if(!project || project.workspaceId.toString() !== workspaceId){
      throw new NotFoundException("Project not found in the workspace")
    }

    const task = await TaskModel.findOne({_id:taskId,workspace:workspaceId,project:projectId})
    .populate("assignedTo","_id name profilePicture -password")
  
    if(!task || task.project.toString() !== projectId){
      throw new NotFoundException("Task not found in the project")
    }
    return {task}
}

export const deleteTaskService = async(workspaceId:string,taskId:string)=>{
    const task = await TaskModel.findOneAndDelete({_id:taskId,workspace:workspaceId})
    if(!task){
      throw new NotFoundException("Task not found in the project")
    }
    return
}