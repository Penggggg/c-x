"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    async myReq(url, options) {
        const backupResult = {
            data: null,
            message: null,
            status: 500
        };
        try {
            options = Object.assign({}, {
                dataType: 'json',
                contentType: 'json',
                timeout: '1000000',
            }, options);
            const iac = await this.ctx.service.common.index.getIAC();
            const javaHeader = this.ctx.cookies.get('x-auth-token');
            options.headers = Object.assign({}, options.headers, {
                'access-token': iac,
                'x-iac-token': iac
            });
            if (javaHeader) {
                options.headers = Object.assign({}, options.headers, {
                    'x-auth-token': javaHeader,
                });
            }
            this.ctx.logger.info(`[Api] ${url} request options: ${JSON.stringify(options)}`);
            const req = await this.ctx.curl(url, options);
            const status = req.data.status || req.data.statusCode;
            this.ctx.logger.info(`[Api] ${url} result: ${JSON.stringify(req.data)}`);
            if (Number(status) !== 0 && Number(status) !== 200) {
                return Object.assign(backupResult, {
                    message: req.data.message,
                });
            }
            const data = req.data;
            return Object.assign(data, {
                status: 200,
            });
        }
        catch (e) {
            this.ctx.logger.error(`[Api] ${url} error: ${JSON.stringify(e)}`);
            return Object.assign(backupResult, {
                message: JSON.stringify(e),
            });
        }
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLEtBQUssQ0FBQyxLQUFLLENBQUUsR0FBRyxFQUFFLE9BQU87UUFFdkIsTUFBTSxZQUFZLEdBQUc7WUFDbkIsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxHQUFHO1NBQ1osQ0FBQztRQUVGLElBQUk7WUFFRixPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUU7Z0JBQzNCLFFBQVEsRUFBRSxNQUFNO2dCQUNoQixXQUFXLEVBQUUsTUFBTTtnQkFDbkIsT0FBTyxFQUFFLFNBQVM7YUFDbkIsRUFBRSxPQUFPLENBQUUsQ0FBQztZQUViLE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUcsQ0FBQztZQUUxRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFeEQsT0FBTyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUcsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFO2dCQUNwRCxjQUFjLEVBQUUsR0FBRztnQkFDbkIsYUFBYSxFQUFFLEdBQUc7YUFDbkIsQ0FBQyxDQUFDO1lBRUgsSUFBSyxVQUFVLEVBQUc7Z0JBQ2hCLE9BQU8sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFHLEVBQUUsT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDcEQsY0FBYyxFQUFFLFVBQVU7aUJBRTNCLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsSUFBSSxDQUFDLFNBQVMsQ0FBRSxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFFbEYsTUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBRSxHQUFHLEVBQUUsT0FBTyxDQUFFLENBQUM7WUFDaEQsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFFdEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLElBQUksQ0FBQyxTQUFTLENBQUUsR0FBRyxDQUFDLElBQUksQ0FBRSxFQUFFLENBQUMsQ0FBQztZQUUzRSxJQUFLLE1BQU0sQ0FBRSxNQUFNLENBQUUsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFFLE1BQU0sQ0FBRSxLQUFLLEdBQUcsRUFBRztnQkFDeEQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFFLFlBQVksRUFBRTtvQkFDbEMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTztpQkFDMUIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxNQUFNLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3RCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBRSxJQUFJLEVBQUU7Z0JBQzFCLE1BQU0sRUFBRSxHQUFHO2FBQ1osQ0FBQyxDQUFDO1NBRUo7UUFBQyxPQUFRLENBQUMsRUFBRztZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsV0FBVyxJQUFJLENBQUMsU0FBUyxDQUFFLENBQUMsQ0FBRSxFQUFFLENBQUMsQ0FBQztZQUNwRSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUUsWUFBWSxFQUFFO2dCQUNsQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBRSxDQUFDLENBQUU7YUFDN0IsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0NBQ0YsQ0FBQyJ9