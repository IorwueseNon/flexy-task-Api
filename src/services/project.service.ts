import ProjectModel from "../models/project.model"

export const createProjectService = async(
    userId:string,workspaceId:string,body:{emoji?:string,name:string,description?:string})=>{
    const project =  new ProjectModel({
         ...(body.emoji && {emoji:body.emoji}),
         name:body.name,
         description:body.description,
         workspaceId: workspaceId,
         createdBy: userId

    })

    await project.save()
    return {project}
}

export const getAllProjectsServiceInWorkspace = async(
    workspaceId:string,pageSize:number,pageNumber:number)=>{
    const totalProjects = await ProjectModel.countDocuments({workspaceId:workspaceId})
    const skip = (pageNumber - 1) * pageSize;
    const projects = await ProjectModel.find({workspaceId}).skip(skip)
    .limit(pageSize)
    .populate("createdBy","_id name profilePicture -password")
    .sort({createdAt:-1})
    
   
   
    const totalPages = Math.ceil(totalProjects / pageSize)
  
    return {projects,totalProjects,totalPages,skip}
}