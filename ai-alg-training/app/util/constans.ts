/**
 * 表名称
 */
const tableNames = {

    /** 系统表 */
    system: "system",

    /** 应用表 */
    app: "app",

    /** 角色表 */
    role: "role",

    /** 权限表 */
    auth: "auth",

    /** 权限 - 按钮 */
    auth_btns: "auth_btns",

    /** 权限 - 页面 */
    auth_pages: "auth_pages",

    /** 权限 - 用户 */
    auth_users: "auth_users",

    /** 页面 - 模块 */
    page_module: 'page_module',

    /** 页面 - 资源 */
    pages: 'pages',

    /** 页面 - 按钮 */
    btns: 'btns'

};

/**
 * 系统表 - 字段名
 */
const systemTable = {
    id: 'id',
    _id: '_id',
    sys_url: 'sys_url',
    sys_name: 'sys_name',
    login_next: 'login_next',
    creator_account: 'creator_account',
    remark: 'remark',
}

/**
 * 应用表 - 字段名
 */
const appTable = {
    id: 'id',
    _id: '_id',
    sys_id: 'sys_id',
    app_name: 'app_name',
    app_path: 'app_path',
    remark: 'remark'
}

/**
 * 角色表 - 字段名
 */
const roleTable = {
    id: 'id',
    _id: '_id',
    name: 'name',
    remark: 'remark',
    app_id: 'app_id',
    sys_id: 'sys_id',
    end_time: 'end_time',
    is_enable: 'is_enable',
    start_time: 'start_time',
}

/**
 * 配置 - 页面模块表
 */
const pageModuleTable = {
    id: 'id',
    _id: '_id',
    code: 'code',
    name: 'name',
    app_id: 'app_id',
    sys_id: 'sys_id'
}

/**
 * 配置 - 页面表
 */
const pagesTable = {
    id: 'id',
    _id: '_id',
    code: 'code',
    name: 'name',
    app_id: 'app_id',
    sys_id: 'sys_id',
    page_module_id: 'page_module_id',
    remark: 'remark'
}

/**
 * 配置 - 按钮表
 */
const btnsTable = {
    id: 'id',
    _id: '_id',
    code: 'code',
    name: 'name',
    page_id: 'page_id',
    remark: 'remark'
}

/**
 * 角色 - 用户表
 */
const authUsersTable = {
    id: 'id',
    _id: '_id',
    name: 'name',
    type: 'type',
    value: 'value',
    role_id: 'role_id'
}

/**
 * 角色 - 页面
 */
const authPagesTable = {
    id: 'id',
    _id: '_id',
    role_id: 'role_id',
    page_id: 'page_id'
}

/**
 * 角色 - 按钮
 */
const authBtnsTable = {
    id: 'id',
    _id: '_id',
    role_id: 'role_id',
    btn_id: 'btn_id'
}

export default {
    
    tableNames,

    appTable,
    roleTable,
    btnsTable,
    pagesTable,
    systemTable,
    authBtnsTable,
    authPagesTable,
    authUsersTable,
    pageModuleTable
}