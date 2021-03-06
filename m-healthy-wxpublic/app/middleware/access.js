"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
exports.default = () => {
    const skipExt = ['.png', '.jpeg', '.jpg', '.ico', '.gif'];
    return async (ctx, next) => {
        const start = new Date().getTime();
        await next();
        const rs = Math.ceil(new Date().getTime() - start);
        ctx.set('X-Response-Time', rs);
        const ext = path.extname(ctx.url).toLocaleLowerCase();
        const isSkip = skipExt.indexOf(ext) !== -1 && ctx.status < 400;
        if (!isSkip) {
            const ip = ctx.get('X-Real-IP') || ctx.ip;
            const port = ctx.get('X-Real-Port');
            const protocol = ctx.protocol.toUpperCase();
            const method = ctx.method;
            const url = ctx.url;
            const status = ctx.status;
            const length = ctx.length || '-';
            const referrer = ctx.get('referrer') || '-';
            const ua = ctx.get('user-agent') || '-';
            const serverTime = ctx.response.get('X-Server-Response-Time') || '-';
            const message = `user [access] ${ip}:${port} - ${method} ${url} ${protocol}/${status} ${length} ${referrer}
rsponseTime: ${rs}, serverResponseTime: ${serverTime}, ua: ${ua}
query: ${JSON.stringify(ctx.query || {})}
body: ${JSON.stringify(ctx.request.body || {})}`;
            ctx.logger.info(message);
        }
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjZXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWNjZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTdCLGtCQUFlLEdBQUcsRUFBRTtJQUNsQixNQUFNLE9BQU8sR0FBRyxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUUsQ0FBQztJQUM1RCxPQUFPLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7UUFDekIsTUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVuQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ2IsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBRW5ELEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUN0RCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBRS9ELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDMUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzVDLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUM7WUFDMUIsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQztZQUNwQixNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO1lBQzFCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDO1lBQ2pDLE1BQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDO1lBQzVDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDO1lBQ3hDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLHdCQUF3QixDQUFDLElBQUksR0FBRyxDQUFDO1lBRXJFLE1BQU0sT0FBTyxHQUFHLGlCQUFpQixFQUFFLElBQUksSUFBSSxNQUFNLE1BQU0sSUFBSSxHQUFHLElBQUksUUFBUSxJQUFJLE1BQU0sSUFBSSxNQUFNLElBQUksUUFBUTtlQUNqRyxFQUFFLHlCQUF5QixVQUFVLFNBQVMsRUFBRTtTQUN0RCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztZQUUzQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxQjtJQUNILENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyJ9