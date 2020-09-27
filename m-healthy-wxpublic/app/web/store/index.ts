
import Vue from 'vue';
import vm$ from './vm';
import account$ from './account';
import globalStore$ from './globalStore';
import appointment$ from './appointment';

export const mappingStore = {
    vm$,
    account$,
    globalStore$,
    appointment$
}

declare module 'vue/types/vue' {
    export interface Vue   {
        vm$: typeof vm$;
        account$: typeof account$;
        globalStore$: typeof globalStore$;
        appointment$: typeof appointment$;
    }
}