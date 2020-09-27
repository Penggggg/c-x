/** 组织架构组件 - 角色类型 */
enum EOrgUserType {
    user,
    org,
    custom
}

/** 用户对于标注任务的权限 */
enum ETaskRole {
    /** 无权限 */
    noRole,
    /** 可查看 */
    read,
    /** 可标注 */
    label,
    /** 可使用（生成数据集），包含可标注 */
    use
}

export {
    ETaskRole,
    EOrgUserType
};