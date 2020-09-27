"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
/** 体征数据详情页 - 分流  */
exports.default = () => {
    return async (ctx, next) => {
        if (ctx.path.includes('/bs')) {
            const { t } = ctx.query;
            const query = `${querystring.stringify(ctx.request.query)}`;
            // 血压
            if (t === '1') {
                return ctx.redirect(`/body-sign/xueya-show?${query}`);
                // 血糖
            }
            else if (t === '3') {
                return ctx.redirect(`/body-sign/xuetang-show?${query}`);
                // 血氧
            }
            else if (t === '2') {
                return ctx.body = '公众号暂未开放血氧数据';
            }
        }
        else {
            await next();
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9keXNpZ25fZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJib2R5c2lnbl9lbnRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDJDQUEyQztBQUUzQyxvQkFBb0I7QUFDcEIsa0JBQWUsR0FBSSxFQUFFO0lBQ2pCLE9BQU8sS0FBSyxFQUFFLEdBQVksRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUNoQyxJQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzNCLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3hCLE1BQU0sS0FBSyxHQUFHLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFFNUQsS0FBSztZQUNMLElBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRztnQkFDYixPQUFPLEdBQUcsQ0FBQyxRQUFRLENBQUMseUJBQXlCLEtBQUssRUFBRSxDQUFDLENBQUM7Z0JBRTFELEtBQUs7YUFDSjtpQkFBTSxJQUFLLENBQUMsS0FBSyxHQUFHLEVBQUc7Z0JBQ3BCLE9BQU8sR0FBRyxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsS0FBSyxFQUFFLENBQUMsQ0FBQztnQkFFNUQsS0FBSzthQUNKO2lCQUFNLElBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRztnQkFDcEIsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQTthQUVsQztTQUNKO2FBQU07WUFDSCxNQUFNLElBQUksRUFBRyxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDIn0=