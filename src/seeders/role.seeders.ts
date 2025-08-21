import "dotenv/config";
import mongoose from "mongoose";
import connectToDatabase from "../config/database.config";
import RoleModel from "../models/role_permission.model";
import { RolePermissions } from "../util/roles-permission";


const seedRoles = async () => {
    console.log("Seeding roles...");
    try{
        await connectToDatabase()
        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("clearing exisitng roles... ")

        await RoleModel.deleteMany({}, { session });

        for(const roleName in RolePermissions){
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role] || [];
          
            const exisitingRole = await RoleModel.findOne({name: role}).session(session)

            if(!exisitingRole){
                const newRole = new RoleModel({
                    name: role,
                    permissions: permissions
                });
                await newRole.save({ session });
                console.log(`Role ${role} created with permissions: ${permissions.join(', ')}`);
            } else {
                console.log(`Role ${role} already exists, skipping creation.`);
            }
           
        }
         await session.commitTransaction();
            console.log("Roles  commited successfully.");
            await session.endSession();
            console.log("Session ended successfully.");
            console.log("Roles seeding completed successfully.");

    }catch (error) {
        console.error("Error seeding roles:", error);
        throw error;
    }
}

seedRoles().catch((error) => {console.error("Seeding failed:", error);})