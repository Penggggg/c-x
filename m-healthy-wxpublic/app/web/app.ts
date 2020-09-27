import Vue from 'vue';
import App from './App.vue';
import { createRouter } from './views/router';

export const createApp = ( ) => {
    const router = createRouter( );
    const app = new Vue({
        router,
        render: h => h( App ),
    });
    return { app, router };
};