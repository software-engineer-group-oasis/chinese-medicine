//权限控制常量
export const ROLE_PREMISSIONS:Record<string,string[]> = {
    教师:[
        'course:create',
        'course:update',
        'course:delete',
        'lab:create',
        'lab:update',
        'lab:delete',
        'resource:create',
    ],
};