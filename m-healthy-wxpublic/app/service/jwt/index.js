"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const egg_1 = require("egg");
const Jwt = require("jsonwebtoken");
/**
 * @method sign 获取签证
 * @method verify 解析签证
 * @method setItem 获取健值
 * @method getItem 设置健值
 */
class JwtService extends egg_1.Service {
    constructor(ctx) {
        super(ctx);
        this.cookieKey = 'auth';
        this.secret = 'm-health-wx';
        this.maxAge = 24 * 60 * 60 * 1000;
        /**
         * @prop { account - openid }
         */
        this.meta = {
            account: {
                sysid: '',
                openid: '',
                nickname: '',
                sex: 1,
                language: '',
                city: '',
                province: '',
                country: '',
                headimgurl: '',
                privilege: []
            }
        };
    }
    async setItem(key, value) {
        const clientMeta = await this.verify(this.ctx.cookies.get(this.cookieKey));
        const content = clientMeta || this.meta;
        const keysArr = key.split('.');
        if (keysArr.length === 1) {
            content[keysArr[0]] = value;
        }
        else {
            const copyArr = keysArr.splice(0, keysArr.length - 1);
            const inner = copyArr.reduce((c, p) => c[p], content);
            inner[keysArr[keysArr.length - 1]] = value;
        }
        return this.sign(content);
    }
    async getItem(key) {
        const clientMeta = await this.verify(this.ctx.cookies.get(this.cookieKey));
        const content = clientMeta || this.meta;
        const keysArr = key.split('.');
        if (keysArr.length === 1) {
            return content[keysArr[0]];
        }
        else {
            const copyArr = keysArr.splice(0, keysArr.length - 1);
            const inner = copyArr.reduce((c, p) => c[p], content);
            return inner[keysArr[keysArr.length - 1]];
        }
    }
    async sign(content, options = {}) {
        return new Promise(resolve => {
            const token = Jwt.sign(content, this.secret, options);
            this.ctx.cookies.set(this.cookieKey, token, { maxAge: this.maxAge });
            resolve();
        });
    }
    async verify(token) {
        return new Promise(resolve => {
            Jwt.verify(token, this.secret, (err, decode) => {
                resolve(err ? null : decode);
            });
        });
    }
}
exports.default = JwtService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDZCQUF1QztBQUN2QyxvQ0FBb0M7QUFFcEM7Ozs7O0dBS0c7QUFDSCxNQUFxQixVQUFXLFNBQVEsYUFBTztJQXdCM0MsWUFBYSxHQUFZO1FBQ3JCLEtBQUssQ0FBRSxHQUFHLENBQUUsQ0FBQztRQXZCQSxjQUFTLEdBQUcsTUFBTSxDQUFDO1FBQ25CLFdBQU0sR0FBRyxhQUFhLENBQUM7UUFDdkIsV0FBTSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUU5Qzs7V0FFRztRQUNLLFNBQUksR0FBRztZQUNYLE9BQU8sRUFBRTtnQkFDTCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTtnQkFDVixRQUFRLEVBQUUsRUFBRTtnQkFDWixHQUFHLEVBQUUsQ0FBQztnQkFDTixRQUFRLEVBQUUsRUFBRTtnQkFDWixJQUFJLEVBQUUsRUFBRTtnQkFDUixRQUFRLEVBQUUsRUFBRTtnQkFDWixPQUFPLEVBQUUsRUFBRTtnQkFDWCxVQUFVLEVBQUUsRUFBRTtnQkFDZCxTQUFTLEVBQUUsRUFBRTthQUNoQjtTQUNKLENBQUM7SUFJRixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBRSxHQUFHLEVBQUUsS0FBSztRQUNyQixNQUFNLFVBQVUsR0FBRyxNQUFNLElBQUksQ0FBQyxNQUFNLENBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFFLElBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQyxDQUFDO1FBQzlFLE1BQU0sT0FBTyxHQUFRLFVBQVUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdDLE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsSUFBSyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRztZ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