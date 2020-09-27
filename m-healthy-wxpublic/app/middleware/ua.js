"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
exports.default = options => {
    return async (ctx, next) => {
        if (ctx.url === '/test') {
            return await next();
        }
        const isMobile = () => {
            const userAgentInfo = ctx.get('user-agent');
            if (!!userAgentInfo.match(/AppleWebKit.*Mobile.*/) || !!userAgentInfo.match(/AppleWebKit/)) {
                const temp = userAgentInfo.toLowerCase();
                if (temp.indexOf('android') > -1 || temp.indexOf('iphone') > -1
                    || temp.indexOf('ipad') > -1 || temp.indexOf('windows phone') > -1
                    || temp.indexOf('blackberry') > -1 || temp.indexOf('hp-tablet') > -1
                    || temp.indexOf('symbian') > -1 || temp.indexOf('phone') > -1) {
                    return true;
                }
            }
            return false;
        };
        if (isMobile()) {
            await next();
        }
        else {
            ctx.body = fs.readFileSync(path.join(__dirname, '../web/ua-error.html'), 'utf-8');
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFFN0Isa0JBQWUsT0FBTyxDQUFDLEVBQUU7SUFDckIsT0FBTyxLQUFLLEVBQUcsR0FBRyxFQUFFLElBQUksRUFBRyxFQUFFO1FBRXpCLElBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxPQUFPLEVBQUc7WUFDdkIsT0FBTyxNQUFNLElBQUksRUFBRyxDQUFDO1NBQ3hCO1FBRUQsTUFBTSxRQUFRLEdBQUcsR0FBSSxFQUFFO1lBQ25CLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDNUMsSUFBSyxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxFQUFHO2dCQUMxRixNQUFNLElBQUksR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQ3pDLElBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzt1QkFDekQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzt1QkFDaEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt1QkFDbEUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUNoRTtvQkFDRSxPQUFPLElBQUksQ0FBQztpQkFDZjthQUNKO1lBQ0QsT0FBTyxLQUFLLENBQUM7UUFDakIsQ0FBQyxDQUFDO1FBQ0YsSUFBSyxRQUFRLEVBQUcsRUFBRTtZQUNkLE1BQU0sSUFBSSxFQUFHLENBQUM7U0FDakI7YUFBTTtZQUNILEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBRSxJQUFJLENBQUMsSUFBSSxDQUFFLFNBQVMsRUFBRSxzQkFBc0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3ZGO0lBQ0wsQ0FBQyxDQUFDO0FBQ04sQ0FBQyxDQUFDIn0=