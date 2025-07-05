import { ROLE_PREMISSIONS} from "@/constants/permissions";
import useAuthStore from "@/store/useAuthStore";

export const userPermission =()=>{
    //获取角色
    const {user,initializeAuth}=useAuthStore();
    if(!user){
        initializeAuth();
        const role = user?.role;
        const permissions = ROLE_PREMISSIONS[role] || [];

        //判断权限
        const hasPermission = (perm:string)=>
            permissions.includes(perm);
        const hasRole = (targetRole:string)=>
            role === targetRole;
        return { hasPermission, hasRole,role };
    }
}