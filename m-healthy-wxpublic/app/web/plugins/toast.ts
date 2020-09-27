import Vue from 'vue';
import { $toast } from '../service/toast';

export const ToastPlugin = {
    install: function( vue, opts ) {
        vue.prototype.$toast = $toast;
    },
};

declare module 'vue/types/vue' {
    export interface Vue   {
        $toast: typeof $toast
    }
}
