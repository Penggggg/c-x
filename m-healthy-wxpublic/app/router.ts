import { Application } from 'egg';
import { commonRouter } from './controller/common/router';
import { renderRouter } from './controller/render/router';
import { accountRouter } from './controller/account/router';
import { personalRouter } from './controller/personal/router';
import { healthCardRouter } from './controller/healthcard/router';
import { healthCheckRouter } from './controller/healthCheck/router';
import { recordRouter } from './controller/record/router';
import { bodySignRouter } from './controller/bodySign/router';
import { questionnaireRouter } from './controller/questionnaire/router';
import { evaluationRouter } from './controller/evaluation/router';
import { appointmentRouter } from './controller/appointment/router';
import { healthServiceRouter } from './controller/healthService/router';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/wx_o', controller.auth.index.qyOauth );
  router.get('/clear_cookies', controller.auth.index.ck );
  // router.get(/^.*(\/sw-.*)\.js$/, controller.common.index.getSw );
  router.get('/service-worker', controller.common.index.getSw );

  renderRouter( app );
  commonRouter( app );
  accountRouter( app );
  personalRouter( app );
  bodySignRouter( app );
  healthCardRouter( app );
  healthCheckRouter( app );
  recordRouter( app );
  evaluationRouter( app );
  appointmentRouter( app );
  healthServiceRouter( app );
  questionnaireRouter( app );

};
