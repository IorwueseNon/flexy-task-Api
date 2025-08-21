import mongoose from "mongoose";
import { PermissionsEnumType, RoleEnum, RoleType,PermissionsEnum } from "../enums/role.enum";
import { RolePermissions } from "../util/roles-permission";


export interface  RoleDocument extends Document {
    name: RoleType;
    permissions:Array<PermissionsEnumType>
} 

const RoleDocumentSchema = new mongoose.Schema<RoleDocument>({
    name: {
        type: String,
        enum: Object.values(RoleEnum),
        required: true,
        unique: true,
    },
    permissions:{
        type: [String],
        enum: Object.values(PermissionsEnum),
        required: true,
        default: function(this: RoleDocument) {
            return RolePermissions[this.name] || [];
            
        }
    }
    },{
        timestamps: true,}
    )

const RoleModel = mongoose.model<RoleDocument>('Role', RoleDocumentSchema);

export default RoleModel;

