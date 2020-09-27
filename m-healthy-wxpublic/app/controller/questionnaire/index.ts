import { Controller } from 'egg';
import axios from 'axios';

/** 报告模块 */
export default class QuestionnaireCtrl extends Controller {

    /** 下载报告 */
    async downloadRecord( ) {
        
        const { ctx } = this;
        const query = ctx.request.query;
        const hostConfig = ctx.app.config.host
        const headers = {
            'x-auth-token': ctx.cookies.get('x-auth-token') || query.x,
            'x-iac-token': await ctx.service.common.index.getIAC( )
        }

        const result = await axios({
            headers,
            method: 'get',
            responseType: 'stream',
            url: `${hostConfig.server}/api/v1/medical_report_pdf_export?medicalNo=${query.medicalNo}`
        });

        ctx.set('content-type', result.headers['content-type']);
        ctx.set('content-disposition', result.headers['content-disposition']);

        return ctx.body = result.data;
    }

}