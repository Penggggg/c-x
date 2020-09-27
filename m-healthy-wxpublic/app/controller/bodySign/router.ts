import { Application, Context } from 'egg';

const apiUrl = `/api/body-sign`;

/** 体征模块路由 */
export const bodySignRouter = ( app: Application ) => {
    const { router, controller } = app;
    if ( !!router && !!controller ) {

    }
    return;
};

export const transfer: transfer = ( ctx: Context, app: Application ) => {
    const { server } = app.config.host;
    return [
        {
            /** 设备来源 */
            url: `${apiUrl}/device-source`,
            java: `${server}/api/sign/v1/findSource`
        }, {
            /** 设备上面的用户列表 */
            url: `${apiUrl}/device-userlist`,
            java: `${server}/api/sign/v1/findDeviceUser`
        }, {
            /** 绑定设备用户 */
            url: `${apiUrl}/device-bind-user`,
            java: `${server}/api/sign/v1/user/bind`
        }, {
            /** 保存体征信息 */
            url: `${apiUrl}/device-data`,
            java: `${server}/api/sign/v1/sign/save`
        }, {
            /** 获取血压信息 */
            url: `${apiUrl}/xueya-data`,
            java: `${server}/api/sign/v1/blood_pressure_period_data`
        }, {
            /** 获取血糖信息 */
            url: `${apiUrl}/xuetang-data`,
            java: `${server}/api/sign/v1/blood_sugar_period_data`
        }, {
            /** 获取最新一条体征报告 */
            url: `${apiUrl}/last_record`,
            java: `${server}/api/sign/v1/last_record`
        }, {
            /** 获取总报告 */
            url: `${apiUrl}/report`,
            java: `${server}/api/sign/v1/sign_report`
        }, {
            /** 保存报告 */
            url: `${apiUrl}/report-save`,
            java: `${server}/api/sign/v1/analysis_log/save`
        }, {
            /** 注册设备用户 */
            url: `${apiUrl}/device-save`,
            java: `${server}/api/sign/v1/device/user/save`
        }, {
            /** 注册设备+绑定用户 */
            url: `${apiUrl}/device-save-bind`,
            java: `${server}/api/sign/v1/device/user/saveAndBind`
        }, {
            /** 修改设备用户 */
            url: `${apiUrl}/device-update`,
            java: `${server}/api/sign/v1/device/user/update`
        }, {
            /** 解除绑定设备用户 */
            url: `${apiUrl}/device-unbind`,
            java: `${server}/api/sign/v1/user/unBind`
        }, {
            /** 删除绑定设备用户 */
            url: `${apiUrl}/device-delete`,
            java: `${server}/api/sign/v1/device/user/delete`
        }, {
            /** 关注设备用户 */
            url: `${apiUrl}/follow`,
            java: `${server}/api/sign/v1/user/follow`
        }, {
            /** 取消关注设备用户 */
            url: `${apiUrl}/unfollow`,
            java: `${server}/api/sign/v1/user/unFollow`
        }, {
            /** 查询绑定过的设备 */
            url: `${apiUrl}/bound-devices`,
            java: `${server}/api/sign/v1/getDetailByUser`
        }, {
            /** 查询用户的账号配置 */
            url: `${apiUrl}/user-config`,
            java: `${server}/api/sign/v1/findUserConfig`
        }, {
            /** 更改用户的账号配置 */
            url: `${apiUrl}/update-user-config`,
            java: `${server}/api/sign/v1/sign/config/saveOrUpdateUser`
        },
        {
            /** 搜索用户 */
            url: `${apiUrl}/:telephone/user/list`,
            java: `${server}/api/v1/:telephone/user/list`
        },
        {
            /** 邀请关注 */
            url: `${apiUrl}/invite/:userId/follow`,
            java: `${server}/api/sign/v1/invite/:userId/follow`
        },
        {
            /** 关注 */
            url: `${apiUrl}/user/follow`,
            java: `${server}/api/sign/v1/user/follow`
        },
        {
            /** 接受关注(体征优化项) */
            url: `${apiUrl}/user/invite_follow`,
            java: `${server}/api/sign/v1/user/invite_follow`
        },
        {
            /** 根据用户查询设备 */
            url: `${apiUrl}/getDetailByUserId`,
            java: `${server}/api/sign/v1/getDetailByUserId`
        },
        {
            /** 查询用户绑定的所有设备 */
            url: `${apiUrl}/findDeviceUser`,
            java: `${server}/api/sign/v1/findDeviceUser`
        },
        {
            /** 查询用户绑定的所有设备 */
            url: `${apiUrl}/add-other`,
            java: `${server}/api/sign/v1/follow/family_user`
        }
    ]
}