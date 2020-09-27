import { Application, Context } from "egg";

const apiUrl = `/api/account`;

/** 账号模块路由 */
export const accountRouter = (app: Application) => {
  const { router, controller } = app;
  if (!!router && !!controller) {
    router.post(`${apiUrl}/bind`, controller.account.index.accountBind);
    router.get(`${apiUrl}/avatar`, controller.account.index.getWxAvatar);
    router.get(`${apiUrl}/wx`, controller.account.index.getWxData);
  }
  return;
};

export const transfer: transfer = (ctx: Context, app: Application) => {
  const { server } = app.config.host;
  return [
    {
      /** 绑定 / 注册接口 */
      url: `${apiUrl}/bind_or_create`,
      java: `${server}/api/v1/wx_user/bind_or_create`
    },
    {
      /** 注册 */
      url: `${apiUrl}/register`,
      java: `${server}/api/v1/user/register`
    },
    {
      /** 通过姓名+号码关联并绑定用户 */
      url: `${apiUrl}/bind/name`,
      java: `${server}/api/v1/wx_user/name_bind`
    },
    {
      /** 通过身份证+号码关联并绑定用户 */
      url: `${apiUrl}/bind/idcard`,
      java: `${server}/api/v1/wx_user/card_bind`
    },
    {
      /** 获取系统上的用户信息 */
      url: `${apiUrl}/system`,
      java: `${server}/api/v1/wx_user`,
      cb: ctx => {
        if (ctx.request.method.toLocaleUpperCase() === "DELETE") {
          ctx.cookies.set("x-username", "", { maxAge: 1 });
          ctx.cookies.set("x-auth-token", "", { maxAge: 1 });
          ctx.cookies.set("auth", "", { maxAge: 1 });
        }
      }
    },
    {
      /** 系统用户信息更新 */
      url: `${apiUrl}/system/:id`,
      java: `${server}/api/v1/wx_user/:id`
    },
    {
      /** 姓名手机号码校验家属信息 */
      url: `${apiUrl}/validate`,
      java: `${server}/api/v1/validate_user`
    },
    {
      /** 添加家属成员 */
      url: `${apiUrl}/addMembers`,
      java: `${server}/api/v1/add_to_family`
    },
    {
      /** 家属成员列表 */
      url: `${apiUrl}/membersList`,
      java: `${server}/api/v1/family_list`
    },
    {
      /** 删除成员 */
      url: `${apiUrl}/deleteMember`,
      java: `${server}/api/v1/family_user`
    }
  ];
};
