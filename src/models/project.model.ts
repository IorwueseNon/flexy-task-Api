import mongoose from "mongoose";

export interface projectDocument extends Document {
    name: string;
    description?: string | null;
    emoji?: string | null;
    workspaceId: mongoose.Types.ObjectId;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const projectSchema = new mongoose.Schema<projectDocument>({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true },
    emoji: { type: String, default: "🏢", trim: true },
    workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},
    {
        timestamps: true,
    }
)

const ProjectModel = mongoose.model<projectDocument>('Project', projectSchema);
export default ProjectModel;