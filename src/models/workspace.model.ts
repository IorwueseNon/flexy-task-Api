import mongoose from "mongoose";
import { generateInviteCode } from "../util/uuid";


export interface WorkspaceDocument extends Document {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const workspaceSchema = new mongoose.Schema<WorkspaceDocument>({
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null, trim: true,required: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    inviteCode: { type: String, required: true, unique: true,  default: generateInviteCode },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

workspaceSchema.methods.resetInviteCode = function (): string {
    this.inviteCode = generateInviteCode();
    return this.inviteCode;
}

const WorkspaceModel = mongoose.model<WorkspaceDocument>('Workspace', workspaceSchema);
export default WorkspaceModel;

