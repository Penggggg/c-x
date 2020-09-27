"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const querystring = require("querystring");
const router_1 = require("../controller/account/router");
const router_2 = require("../controller/common/router");
const router_3 = require("../controller/booking/router");
const router_4 = require("../controller/record/router");
const router_5 = require("../controller/healthcard/router");
const router_6 = require("../controller/healthCheck/router");
const router_7 = require("../controller/myOrder/router");
const router_8 = require("../controller/bodySign/router");
const router_9 = require("../controller/evaluation/router");
const router_10 = require("../controller/appointment/router");
const router_11 = require("../controller/healthService/router");
const router_12 = require("../controller/questionnaire/router");
// const basePath = path.join( __dirname, '../controller/');
// fs.readdirSync( basePath ).map( item => {
//     const filePath = `${basePath}${item}/router.js`;
//     if ( fs.existsSync(`${filePath}`)) {
//         const defaultImport = require( filePath );
//     }
//     console.log( '...', fs.existsSync(`${filePath}` ));
// });
exports.default = (options, app) => {
    return async (ctx, next) => {
        /** 在这里增加，转发模块 */
        const allTransferList = [router_1.transfer, router_2.transfer, router_3.transfer, router_4.transfer, router_5.transfer, router_6.transfer, router_7.transfer, router_8.transfer, router_9.transfer, router_10.transfer, router_11.transfer, router_12.transfer];
        let transferItem = null;
        const { path, method, query } = ctx.request;
        /**
         * 1. 匹配路径
         * 2. 匹配方法
         * 3. 转发（ params + query + data ）
         */
        allTransferList.some(moduleTransfer => {
            const transferList = moduleTransfer(ctx, app);
            const gotTransferItem = transferList.some(transfer => {
                const hasParams = transfer.url.includes(':');
                /** 1. 情况1: 无params，且请求路径、方法完全匹配 */
                if (!hasParams) {
                    if (path === transfer.url &&
                        (!transfer.method ||
                            transfer.method
                                .split(',')
                                .find(x => x.toLocaleLowerCase() === method.toLocaleLowerCase()))) {
                        transferItem = transfer;
                        return true;
                    }
                    return false;
                }
                else {
                    const reqUrlItem = path.split('/').filter(x => !!x);
                    const configUrlItem = transfer.url.split('/').filter(x => !!x);
                    /** 2. 情况2: 有params，但请求路径并不匹配 */
                    if (configUrlItem.length !== reqUrlItem.length) {
                        return false;
                    }
                    else {
                        /** 3. 情况3: 有params，且路径、方法均匹配 */
                        const isFit = configUrlItem.every((urlItem, k) => {
                            if (urlItem.startsWith(':')) {
                                return true;
                            }
                            else {
                                return urlItem === reqUrlItem[k];
                            }
                        });
                        if (isFit &&
                            (!transfer.method ||
                                transfer.method
                                    .split(',')
                                    .find(x => x.toLocaleLowerCase() === method.toLocaleLowerCase()))) {
                            transferItem = transfer;
                            return true;
                        }
                        return false;
                    }
                }
            });
            return !!gotTransferItem;
        });
        if (!!transferItem) {
            const paramsObj = {};
            const reqUrlItem = path.split('/').filter(x => !!x);
            const configUrlItem = transferItem.url.split('/').filter(x => !!x);
            const configJavaItem = transferItem.java.split('/').filter(x => !!x);
            // 找到各个params的值、替换到javaUrl
            configUrlItem.map((x, k) => {
                if (x.startsWith(':')) {
                    paramsObj[x] = reqUrlItem[k];
                }
            });
            const finalUrl = configJavaItem.map(x => {
                return !x.startsWith(':') ?
                    x :
                    paramsObj[x];
            });
            if (finalUrl[0] === 'http:' || finalUrl[0] === 'https:') {
                finalUrl[0] += '/';
            }
            // 转发
            const req = await ctx.helper.myReq(`${finalUrl.join('/')}?${querystring.stringify(ctx.request.query)}`, {
                data: ctx.request.body,
                method: ctx.request.method.toLocaleUpperCase(),
            });
            if (transferItem.cb) {
                transferItem.cb(ctx);
            }
            return ctx.body = req;
        }
        else {
            return await next();
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0cmFuc2Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDJDQUEyQztBQUUzQyx5REFBOEQ7QUFDOUQsd0RBQTZEO0FBQzdELHlEQUE4RDtBQUM5RCx3REFBNkQ7QUFDN0QsNERBQWlFO0FBQ2pFLDZEQUFrRTtBQUNsRSx5REFBOEQ7QUFDOUQsMERBQStEO0FBQy9ELDREQUFpRTtBQUNqRSw4REFBbUU7QUFDbkUsZ0VBQXFFO0FBQ3JFLGdFQUFxRTtBQUVyRSw0REFBNEQ7QUFFNUQsNENBQTRDO0FBQzVDLHVEQUF1RDtBQUN2RCwyQ0FBMkM7QUFDM0MscURBQXFEO0FBQ3JELFFBQVE7QUFDUiwwREFBMEQ7QUFDMUQsTUFBTTtBQUVOLGtCQUFlLENBQUUsT0FBTyxFQUFFLEdBQWdCLEVBQUcsRUFBRTtJQUMzQyxPQUFPLEtBQUssRUFBRyxHQUFZLEVBQUUsSUFBSSxFQUFHLEVBQUU7UUFFbEMsaUJBQWlCO1FBQ2pCLE1BQU0sZUFBZSxHQUFHLENBQUUsaUJBQUUsRUFBRSxpQkFBRSxFQUFFLGlCQUFFLEVBQUUsaUJBQUUsRUFBRSxpQkFBRSxFQUFFLGlCQUFFLEVBQUUsaUJBQUUsRUFBRSxpQkFBRSxFQUFFLGlCQUFFLEVBQUUsa0JBQUcsRUFBQyxrQkFBRyxFQUFDLGtCQUFHLENBQUUsQ0FBQztRQUM1RSxJQUFJLFlBQVksR0FBUSxJQUFJLENBQUM7UUFDN0IsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztRQUU1Qzs7OztXQUlHO1FBQ0gsZUFBZSxDQUFDLElBQUksQ0FBRSxjQUFjLENBQUMsRUFBRTtZQUNuQyxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBRSxDQUFDO1lBQ2hELE1BQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxJQUFJLENBQUUsUUFBUSxDQUFDLEVBQUU7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