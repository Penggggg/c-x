import Vue from 'vue';
import Router from 'vue-router';
import accountModule from './account';
import bookingModule from './booking';
import recordModule from './record';
import commonModule from './common';
import healthCardModule from './health-card';
import healthCheckModule from './health-check';
import myOrderModule from './my-order';
import bodySignModule from './body-sign';
import evaluationModule from './evaluation';
import testModule from './test';
import appointmentModule from './appointment';
import healthService from './health-service';
import questionnaireModule from './questionnaire';
import activityModule from './activity';
Vue.use(Router);
export var createRouter = function () {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: function () { return import('./Home.vue'); },
                children: [
                    activityModule,
                    recordModule,
                    accountModule,
                    bookingModule,
                    commonModule,
                    healthCardModule,
                    healthCheckModule,
                    myOrderModule,
                    bodySignModule,
                    evaluationModule,
                    testModule,
                    appointmentModule,
                    healthService,
                    questionnaireModule
                ]
            },
        ],
    });
};
//# sourceMappingURL=router.js.map