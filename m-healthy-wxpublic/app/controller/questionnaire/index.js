"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const axios_1 = require("axios");
/** 报告模块 */
class QuestionnaireCtrl extends egg_1.Controller {
    /** 下载报告 */
    async downloadRecord() {
        const { ctx } = this;
        const query = ctx.request.query;
        const hostConfig = ctx.app.config.host;
        const headers = {
            'x-auth-token': ctx.cookies.get('x-auth-token') || query.x,
            'x-iac-token': await ctx.service.common.index.getIAC()
        };
        const result = await axios_1.default({
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
exports.default = QuestionnaireCtrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUNqQyxpQ0FBMEI7QUFFMUIsV0FBVztBQUNYLE1BQXFCLGlCQUFrQixTQUFRLGdCQUFVO0lBRXJELFdBQVc7SUFDWCxLQUFLLENBQUMsY0FBYztRQUVoQixNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO1FBQ2hDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQTtRQUN0QyxNQUFNLE9BQU8sR0FBRztZQUNaLGNBQWMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQztZQUMxRCxhQUFhLEVBQUUsTUFBTSxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFHO1NBQzFELENBQUE7UUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLGVBQUssQ0FBQztZQUN2QixPQUFPO1lBQ1AsTUFBTSxFQUFFLEtBQUs7WUFDYixZQUFZLEVBQUUsUUFBUTtZQUN0QixHQUFHLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSwrQ0FBK0MsS0FBSyxDQUFDLFNBQVMsRUFBRTtTQUM1RixDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDeEQsR0FBRyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztRQUV0RSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNsQyxDQUFDO0NBRUo7QUExQkQsb0NBMEJDIn0=