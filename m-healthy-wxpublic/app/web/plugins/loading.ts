import Vue from 'vue';
import { loading } from '../service/loading';

export const LoadingPlugin = {
    install: function( vue, opts ) {
        vue.prototype.loading$ = loading;
    },
};

declare module 'vue/types/vue' {
    export interface Vue   {
        loading$: typeof loading
    }
}
