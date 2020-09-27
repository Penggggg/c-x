import { httpv2 } from "../../service/httpv2";
import { observable, action, autorun, toJS } from "mobx";

/** 判断字典值是否存在 */
const checkDicExist = (code: string, dic: object): string => {
  const _code: string[] = code.split(",");
  const res: string[] = [];
  _code.map((item: string) => {
    if (toJS(dic[item]).length === 0) res.push(item);
  });
  return res.join(",");
};

/** 预约整合 */
export default class Order {
  /** 健康中心Id */
  @observable hospitalId = "";

  @observable HMS_CLINIC_FIRST_DEPT = "HMS_CLINIC_FIRST_DEPT"; // 一级科室
  @observable HMS_DOCTOR_POSITION = "HMS_DOCTOR_POSITION"; // 医生职级

  @observable dictionary = {
    [this.HMS_CLINIC_FIRST_DEPT]: [],
    [this.HMS_DOCTOR_POSITION]: []
  };

  /** 当前健康中心 */
  @observable currentHospital = {
    id: "",
    name: ""
  };

  /** 获取常规数据字典 */
  @action.bound loadCommonDic() {
    let code = "HMS_CLINIC_FIRST_DEPT,HMS_DOCTOR_POSITION";
    code = checkDicExist(code, this.dictionary);
    code &&
      httpv2
        .get<any>({
          url: `/api/common/dic?typeCode= ${code}`
        })
        .then(res => {
          const { status, data } = res;
          if (status !== 200) {
            return;
          }
          this.dictionary = Object.assign(this.dictionary, data);
        });
  }

  // /** 获取客户端ip */
  // @action.bound getClientIp( ) {
  //     httpv2.get({
  //         url: `/api/common/client-ip`
  //     }).then(( res: any ) => {
  //         this.ip = res;
  //     });
  // }

  // /** 获取系统相关账号信息 */
  // @action.bound getSysData( appId, openId ) {
  //     return httpv2.get<normalResult<App.systemUser>>({
  //         url: `/api/account/system?appId=${appId}&openId=${openId}`
  //     }, {
  //         loadMsg: '加载中...'
  //     }).then( res => {
  //         const { status, data } = res;
  //         if ( status !== 200 ) {
  //             return this.hasBeenBound = false;
  //         }
  //         this.loading = false;
  //         this.systemUser = data;
  //         this.hasBeenBound = !!data ? true : false;

  //         localStorage.setItem( 'username$', data.name );
  //         localStorage.setItem( 'telephone$', data.telephone );
  //         localStorage.setItem( 'sysid$', data.id );

  //         return data;
  //     });
  // }
}
