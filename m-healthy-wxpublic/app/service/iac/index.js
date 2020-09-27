"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const ciac = require("@cvte/ciac");
class IacService extends egg_1.Service {
    constructor(ctx) {
        super(ctx);
        this.iacConfig = this.app.config.iac;
    }
    async getToken(appid = this.iacConfig.appid, appSecret = this.iacConfig.secret) {
        try {
            return await ciac.getToken(appid, appSecret);
        }
        catch (e) {
            return '';
        }
    }
}
exports.default = IacService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUF1QztBQUN2QyxtQ0FBbUM7QUFFbkMsTUFBcUIsVUFBVyxTQUFRLGFBQU87SUFJN0MsWUFBYSxHQUFZO1FBQ3ZCLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQztRQUhQLGNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFJeEMsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFRLENBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU07UUFDN0UsSUFBSTtZQUNGLE9BQU8sTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFFLEtBQUssRUFBRSxTQUFTLENBQUUsQ0FBQztTQUNoRDtRQUFDLE9BQVEsQ0FBQyxFQUFHO1lBQ1osT0FBTyxFQUFFLENBQUM7U0FDWDtJQUNILENBQUM7Q0FFRjtBQWhCRCw2QkFnQkMifQ==