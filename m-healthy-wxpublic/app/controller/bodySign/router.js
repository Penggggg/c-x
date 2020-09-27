"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrl = `/api/body-sign`;
/** 体征模块路由 */
exports.bodySignRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
    }
    return;
};
exports.transfer = (ctx, app) => {
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
    ];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUM7QUFFaEMsYUFBYTtBQUNBLFFBQUEsY0FBYyxHQUFHLENBQUUsR0FBZ0IsRUFBRyxFQUFFO0lBQ2pELE1BQU0sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQ25DLElBQUssQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsVUFBVSxFQUFHO0tBRS9CO0lBQ0QsT0FBTztBQUNYLENBQUMsQ0FBQztBQUVXLFFBQUEsUUFBUSxHQUFhLENBQUUsR0FBWSxFQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUNuRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbkMsT0FBTztRQUNIO1lBQ0ksV0FBVztZQUNYLEdBQUcsRUFBRSxHQUFHLE1BQU0sZ0JBQWdCO1lBQzlCLElBQUksRUFBRSxHQUFHLE1BQU0seUJBQXlCO1NBQzNDLEVBQUU7WUFDQyxnQkFBZ0I7WUFDaEIsR0FBRyxFQUFFLEdBQUcsTUFBTSxrQkFBa0I7WUFDaEMsSUFBSSxFQUFFLEdBQUcsTUFBTSw2QkFBNkI7U0FDL0MsRUFBRTtZQUNDLGFBQWE7WUFDYixHQUFHLEVBQUUsR0FBRyxNQUFNLG1CQUFtQjtZQUNqQyxJQUFJLEVBQUUsR0FBRyxNQUFNLHdCQUF3QjtTQUMxQyxFQUFFO1lBQ0MsYUFBYTtZQUNiLEdBQUcsRUFBRSxHQUFHLE1BQU0sY0FBYztZQUM1QixJQUFJLEVBQUUsR0FBRyxNQUFNLHdCQUF3QjtTQUMxQyxFQUFFO1lBQ0MsYUFBYTtZQUNiLEdBQUcsRUFBRSxHQUFHLE1BQU0sYUFBYTtZQUMzQixJQUFJLEVBQUUsR0FBRyxNQUFNLHlDQUF5QztTQUMzRCxFQUFFO1lBQ0MsYUFBYTtZQUNiLEdBQUcsRUFBRSxHQUFH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