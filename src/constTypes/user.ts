export interface User {
    username: string,
    password: string,
    phone: string,
    email: string,
    role: string,
    avatarUrl: string | null,
}

export const userColumns = [
    {title:"用户名", dataIndex:"username", key:"username"},
    {title:"电话", dataIndex:"phone", key:"phone"},
    {title:"邮件", dataIndex:"email", key:"email"},
]

export const roleOptions = ["普通用户", "教师", "学生", "管理员", "超级管理员"]


export interface InvitationCode {
    codeId: number,
    code: string,
    categoryId: number,
    createUserId: number,
    inviteSchool: string,
    inviteName: string,
    codeIsUsed: boolean,
    codeExpireTime: string,

}