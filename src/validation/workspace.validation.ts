import { z} from 'zod';
export const workspaceNameSchema = z.string().trim().min(1,{message: "name is required"} ).max(100, "Workspace name must be less than 100 characters");
export const workspaceDescriptionSchema = z.string().trim().max(225, "Workspace description must be less than 500 characters").optional();

export const workspaceIdSchema = z.string().trim().min(1, { message: "Workspace ID is required" })


export const createworkspaceSchema  = z.object({
  name: workspaceNameSchema,
  description: workspaceDescriptionSchema,
})

export const changeRoleSchema = z.object({
    roleId: z.string().trim().min(1,{message:"Role ID is required"}),
    memberId: z.string().trim().min(1,{message:"Member ID is required"})
})

export const updateWorkspaceSchema = z.object({
    name: workspaceNameSchema.optional(),
    description: workspaceDescriptionSchema.optional(),
})
