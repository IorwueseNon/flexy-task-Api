import mongoose ,{Types}from "mongoose";
import { TaskStatusType, TaskPriorityType,TaskPriorityEnum,TaskStatusEnum } from "../enums/task.enum";
import { generateTaskCode } from "../util/uuid";


export interface TaskDocument extends Document {
    taskCode: string;
    title: string;
    description: string | null;
    project: mongoose.Types.ObjectId;
    workspace: mongoose.Types.ObjectId;
    status:TaskStatusType;
    priority:TaskPriorityType
    assignedTo: mongoose.Types.ObjectId | null;
    createdBy: mongoose.Types.ObjectId;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;

}

const taskSchema = new mongoose.Schema<TaskDocument>({
    taskCode: { type: String, required: true, unique: true, default:generateTaskCode },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
    status: { type: String, enum: Object.values(TaskStatusEnum), default: TaskStatusEnum.TODO },
    priority: { type: String, enum: Object.values(TaskPriorityEnum), default: TaskPriorityEnum.MEDIUM },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dueDate: { type: Date, default: null }
}, {
    timestamps: true
})

const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema);
export default TaskModel;