/** 组织架构组件 - 角色类型 */
enum EOrgUserType {
    user,
    org,
    custom
}

/** 登陆后，用户主动选择的角色类型 */
enum EUserRole {
    normal,
    adm,
    superAdm
}

export { 
    EOrgUserType ,
    EUserRole
};