import AuthCtrl from './controller/auth';
import RenderCtrl from './controller/render';
import PersonalCtrl from './controller/personal';
import CommonCtrl from './controller/common';
import AccountCtrl from './controller/account';
import BookingCtrl from './controller/booking';
import RecordCtrl from './controller/record';
import HealthCardCtrl from './controller/healthcard';
import HealthServiceCtrl from './controller/healthService';
import HealthCheckCtrl from './controller/healthCheck';
import BodySignCtrl from './controller/bodySign';
import AppointmentCtrl from './controller/appointment';
import EvaluationCtrl from './controller/evaluation'
import MyOrderCtrl from './controller/myOrder';
import QuestionnaireCtrl from './controller/questionnaire';
import JwtService from './service/jwt';
import IacService from './service/iac';
import AccountService from './service/account';
import wechatService from './service/wechat';
import commondService from './service/common';

declare module 'egg' {

    export interface IController {

        render: {
            index: RenderCtrl
        }

        evaluation: {
            index: EvaluationCtrl
        }

        personal: {
            index: PersonalCtrl
        }

        auth: {
            index: AuthCtrl
        }

        common: {
            index: CommonCtrl
        }

        account: {
            index: AccountCtrl
        }

        booking: {
            index: BookingCtrl
        }

        record: {
            index: RecordCtrl
        }

        bodySign: {
            index: BodySignCtrl
        }

        healthcard: {
            index: HealthCardCtrl
        }

        healthCheck: {
            index: HealthCheckCtrl
        }

        myOrder: {
            index: MyOrderCtrl
        }
        questionnaire: {
            index: QuestionnaireCtrl
        }
        appointment: {
            index: AppointmentCtrl
        }
        healthService: {
            index: HealthServiceCtrl
        }

    }

    export interface IService {

        jwt: {
            index: JwtService
        }

        iac: {
            index: IacService
        }

        wechat: {
            index: wechatService
        }

        common: {
            index: commondService
        }

        account: {
            index: AccountService
        }

    }

}