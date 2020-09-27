"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const axios_1 = require("axios");
/** 报告模块 */
class RecordCtrl extends egg_1.Controller {
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
exports.default = RecordCtrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUFpQztBQUNqQyxpQ0FBMEI7QUFFMUIsV0FBVztBQUNYLE1BQXFCLFVBQVcsU0FBUSxnQkFBVTtJQUU5QyxXQUFXO0lBQ1gsS0FBSyxDQUFDLGNBQWM7UUFFaEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztRQUNoQyxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUE7UUFDdEMsTUFBTSxPQUFPLEdBQUc7WUFDWixjQUFjLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUM7WUFDMUQsYUFBYSxFQUFFLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRztTQUMxRCxDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxlQUFLLENBQUM7WUFDdkIsT0FBTztZQUNQLE1BQU0sRUFBRSxLQUFLO1lBQ2IsWUFBWSxFQUFFLFFBQVE7WUFDdEIsR0FBRyxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sK0NBQStDLEtBQUssQ0FBQyxTQUFTLEVBQUU7U0FDNUYsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3hELEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7UUFFdEUsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDbEMsQ0FBQztDQUVKO0FBMUJELDZCQTBCQyJ9