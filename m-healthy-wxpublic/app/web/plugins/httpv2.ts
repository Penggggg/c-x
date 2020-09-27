import Vue from 'vue';
import { httpv2 } from '../service/httpv2';

export const HttpPluginV2 = {
    install: function( vue, opts ) {
        vue.prototype.http$ = httpv2;
    },
};

declare module 'vue/types/vue' {
    export interface Vue   {
      http$: typeof httpv2
    }
}
