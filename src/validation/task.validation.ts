import z, { object } from "zod";
import { TaskPriorityEnum, TaskStatusEnum } from "../enums/task.enum";


export const titleSchema = z.string().trim().min(1).max(100)
export const descriptionSchema = z.string().trim().max(500)
export const prioritySchema = z.enum(Object.values(TaskPriorityEnum) as [string, ...string[]])
export const statusSchema = z.enum(Object.values(TaskStatusEnum) as [string, ...string[]])
export const assignedToSchema = z.string().trim().min(1).nullable().optional()
export const dueDateSchema = z.string().trim().optional().refine((val) => {
    return !val || !isNaN(Date.parse(val))
}
    , { message: "Invalid date format" })
export const taskIdSchema = z.string().trim().min(1)


export const createTaskSchema = z.object({
    title: titleSchema,
    description: descriptionSchema,
    priority: prioritySchema,
    status: statusSchema,
    assignedTo: assignedToSchema,
    dueDate: dueDateSchema,

})

export const updateTaskSchema = z.object({
    title: titleSchema.optional(),
    description: descriptionSchema.optional(),
    priority: prioritySchema.optional(),
    status: statusSchema.optional(),
    assignedTo: assignedToSchema.optional(),
    dueDate: dueDateSchema.optional(),
})