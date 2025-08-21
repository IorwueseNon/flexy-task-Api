import mongoose from "mongoose";
import { AccountProviderTypeEnum,AccountProviderEnum } from "../enums/account-provider.enum";


export interface AccountProviderDocumnent extends Document{
    provider: AccountProviderTypeEnum,
    providerId: string,
    userId: mongoose.Types.ObjectId,
    refreshToken?: string | null,
    accessToken?: string | null,
    createdAt: Date,
    updatedAt: Date
}

const accountProviderSchema = new mongoose.Schema<AccountProviderDocumnent>({
    provider: { type: String,  enum: Object.values(AccountProviderEnum),required: true, },
    providerId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refreshToken: { type: String, default: null },
    accessToken: { type: String, default: null }
}, {
    timestamps: true,
    toJSON:{
        transform: function (doc, ret) {
            delete ret.refreshToken
        }
    }

});

const AccountProviderModel = mongoose.model<AccountProviderDocumnent>('AccountProvider', accountProviderSchema);
export default AccountProviderModel;

