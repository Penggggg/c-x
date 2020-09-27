// This file was auto created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import AccountIndex from '../../../app/controller/account/index';
import AccountRouter from '../../../app/controller/account/router';
import AppointmentIndex from '../../../app/controller/appointment/index';
import AppointmentRouter from '../../../app/controller/appointment/router';
import AuthIndex from '../../../app/controller/auth/index';
import BodySignIndex from '../../../app/controller/bodySign/index';
import BodySignRouter from '../../../app/controller/bodySign/router';
import BookingIndex from '../../../app/controller/booking/index';
import BookingRouter from '../../../app/controller/booking/router';
import CommonIndex from '../../../app/controller/common/index';
import CommonRouter from '../../../app/controller/common/router';
import EvaluationIndex from '../../../app/controller/evaluation/index';
import EvaluationRouter from '../../../app/controller/evaluation/router';
import HealthCheckIndex from '../../../app/controller/healthCheck/index';
import HealthCheckRouter from '../../../app/controller/healthCheck/router';
import HealthServiceIndex from '../../../app/controller/healthService/index';
import HealthServiceRouter from '../../../app/controller/healthService/router';
import HealthcardIndex from '../../../app/controller/healthcard/index';
import HealthcardRouter from '../../../app/controller/healthcard/router';
import MyOrderIndex from '../../../app/controller/myOrder/index';
import MyOrderRouter from '../../../app/controller/myOrder/router';
import PersonalIndex from '../../../app/controller/personal/index';
import PersonalRouter from '../../../app/controller/personal/router';
import QuestionnaireIndex from '../../../app/controller/questionnaire/index';
import QuestionnaireRouter from '../../../app/controller/questionnaire/router';
import RecordIndex from '../../../app/controller/record/index';
import RecordRouter from '../../../app/controller/record/router';
import RenderIndex from '../../../app/controller/render/index';
import RenderRouter from '../../../app/controller/render/router';

declare module 'egg' {
  interface IController {
    account: {
      index: AccountIndex;
      router: AccountRouter;
    };
    appointment: {
      index: AppointmentIndex;
      router: AppointmentRouter;
    };
    auth: {
      index: AuthIndex;
    };
    bodySign: {
      index: BodySignIndex;
      router: BodySignRouter;
    };
    booking: {
      index: BookingIndex;
      router: BookingRouter;
    };
    common: {
      index: CommonIndex;
      router: CommonRouter;
    };
    evaluation: {
      index: EvaluationIndex;
      router: EvaluationRouter;
    };
    healthCheck: {
      index: HealthCheckIndex;
      router: HealthCheckRouter;
    };
    healthService: {
      index: HealthServiceIndex;
      router: HealthServiceRouter;
    };
    healthcard: {
      index: HealthcardIndex;
      router: HealthcardRouter;
    };
    myOrder: {
      index: MyOrderIndex;
      router: MyOrderRouter;
    };
    personal: {
      index: PersonalIndex;
      router: PersonalRouter;
    };
    questionnaire: {
      index: QuestionnaireIndex;
      router: QuestionnaireRouter;
    };
    record: {
      index: RecordIndex;
      router: RecordRouter;
    };
    render: {
      index: RenderIndex;
      router: RenderRouter;
    };
  }
}
