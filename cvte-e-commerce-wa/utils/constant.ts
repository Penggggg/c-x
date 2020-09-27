/** 线上支付超时设置 */
export const OnlinePayDeadLine = 30 * 60 * 1000;

/** 线下支付超时设置 */
export const OfflinePayDeadLine = 10 * 24 * 60 * 60 * 1000;

/** 全局 - 本地存储变量 */
export enum StorageKey {

    /** 注册时填充的分享人的id */
    REGISTER_INVITER = '0',
    
    /** 登陆人的系统信息 */
    SYSTEM_USER_INFO = '1',

    /** 注册时填充的分享来源 */
    REGISTER_INVITER_TYPE = '2',

};

/** 枚举 - 邀请来源类型 */
export enum InviteType {

    /** 分享优惠券 */
    SHARE_COUPON = 'SHARE_COUPON',

    /** 分享商品 */
    SHARE_GOODS = 'SHARE_GOODS',

    /** 分享二维码 */
    SHARE_QRCODE = 'SHARE_QRCODE',

};

/** 后台枚举 - 发票选择类型 */
export enum InvoiceChoiceType {

    /** 企业 */
    company = "ENTERPRISE",

    /** 个人 */
    personal = "PERSONAL",

    /** 无需 */
    noneed = "NO_TICKETS"

}

/** 后台枚举 - 发票选择类型 */
export enum InvoiceChoiceTypeCN {

    /**  */
    ENTERPRISE = "企业",

    /**  */
    PERSONAL = "个人",

    /**  */
    NO_TICKETS = "无需"

}

/** 后台枚举 - 普票/专票 */
export enum InvoiceType {

    /** 普票 */
    normal = 'GENERAL_VOTE',

    /** 专票 */
    specail = 'SPECIAL_VOTE'
}

/** 后台枚举 - 普票/专票 */
export enum InvoiceTypeCN {

    /**  */
    GENERAL_VOTE = '普票',

    /**  */
    SPECIAL_VOTE = '专票'
}

/** 后台枚举 - 订单状态 */
export enum OrderState {

    /** 待支付 */
    WAIT_PAY = 'WAIT_PAY',

    /** 支付审核 */
    PAY_APPROVAL = 'PAY_APPROVAL',

    /** 待发货 */
    WAIT_DELIVER = 'WAIT_DELIVER',

    /** 待收货 */
    WAIT_RECEIVER = 'WAIT_RECEIVER',

    /** 取消订单 */
    CANCEL = 'CANCEL',

    /** 关闭订单 */
    CLOSE = 'CLOSE',

    /** 完成订单 */
    COMPLETE = 'COMPLETE',

    /** 订单确认 */
    ORDER_CONFIRM = 'ORDER_CONFIRM'
}

/** 后台枚举 - 订单状态 */
export enum OrderStateCN {

    /** 待支付 */
    WAIT_PAY = '待支付',

    /** 支付审核 */
    PAY_APPROVAL = '待审核',

    /** 待发货 */
    WAIT_DELIVER = '待发货',

    /** 待收货 */
    WAIT_RECEIVER = '待收货',

    /** 取消订单 */
    CANCEL = '已取消',

    /** 关闭订单 */
    CLOSE = '已关闭',

    /** 完成订单 */
    COMPLETE = '已完成',

    /** 订单确认 */
    ORDER_CONFIRM = '订单确认'
}

/** 后台枚举 - 订单支付方式 */
export enum OrderPayType {

    /** 线上支付 */
    ONLINE_PAY = 'ONLINE_PAY',

    /** 线下支付 */
    OFFLINE_PAY = 'OFFLINE_PAY'    

}

/** 后台枚举 - 订单支付方式 */
export enum OrderPayTypeCN {

    ONLINE_PAY = '线上支付',

    /**  */
    OFFLINE_PAY = '线下支付'    

}