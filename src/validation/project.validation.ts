import z from "zod";

export const emojiSchema = z.string().trim().optional()
export const nameSchema = z.string().trim().min(1).max(50)
export const descriptionSchema = z.string().trim().max(500).optional()

export const createProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema
    
})

export const updateProjectSchema = z.object({
    emoji: emojiSchema,
    name: nameSchema,
    description: descriptionSchema
   
})