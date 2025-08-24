import { PermissionsEnumType } from "../enums/role.enum";
import { UnauthorizedException } from "./appError";
import { RolePermissions } from "./roles-permission";



export function rowGuard(userRole: keyof typeof RolePermissions, allowedRoles: PermissionsEnumType[]) {
   const permissions = RolePermissions[userRole];


   const haspermission = allowedRoles.every((permission)=> permissions.includes(permission));
   if(!haspermission){
      throw new UnauthorizedException("Access Denied: You do not have the required permissions to perform this action.");
   }
}