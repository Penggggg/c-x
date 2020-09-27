import Vue from 'vue';

const utilFunc = {
    // 判断是否为ios
    isIOS: ( ) => {
        let isIphone = navigator.userAgent.includes('iPhone')
        let isIpad = navigator.userAgent.includes('iPad')
        return isIphone || isIpad
    },
    // 获取url参数
    getQueryString: (name: any) => {
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        const r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
}

export const UtilPlugin = {
    install: function( vue, opts ) {
        vue.prototype.$util = utilFunc;
    },
};

declare module 'vue/types/vue' {
    export interface Vue   {
        $util: typeof utilFunc
    }
}
