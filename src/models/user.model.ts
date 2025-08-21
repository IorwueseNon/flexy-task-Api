import mongoose,{ Document, } from "mongoose";
import { comparePassword, hashPassword } from "../util/bycript";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password?: string;  
    profilePicture?: string;
    isActive: boolean; 
    lastLoginAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    currentWorkspace: mongoose.Types.ObjectId | null;
    comparePassword: (password: string) => Promise<boolean>;
    omitPassword: () => Omit<UserDocument, 'password'>;
}


const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, 
        required:false,
        trim: true },
    email: { type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true, },
    password: { type: String, select: true }, // Password is not selected by default
    profilePicture: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    currentWorkspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', default: null }
}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        if (this.password) {
        this.password = await hashPassword(this.password);
        }
    }
    next();
});

userSchema.methods.omitPassword = function (): Omit<UserDocument, 'password'> {
    const user = this.toObject();
    delete user.password;
    return user;
}

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return await comparePassword(password, this.password);
};  

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;