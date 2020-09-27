import Vue from 'vue';
import { http } from '../service/http';

export const HttpPlugin = {
    install: function( vue, opts ) {
        vue.prototype._http = http;
    },
};

declare module 'vue/types/vue' {
    export interface Vue   {
      _http: typeof http;
    }
}
