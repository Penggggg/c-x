"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
exports.default = async (ctx, next) => {
    ctx.app.use(bodyParser.urlencoded({
        extended: true
    }));
    await next();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1scGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ4bWxwYXJzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUEwQztBQUUxQyxrQkFBZSxLQUFLLEVBQUcsR0FBRyxFQUFFLElBQUksRUFBRyxFQUFFO0lBQ2pDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUM7UUFDL0IsUUFBUSxFQUFFLElBQUk7S0FDZixDQUFDLENBQUMsQ0FBQztJQUNOLE1BQU0sSUFBSSxFQUFHLENBQUM7QUFDbEIsQ0FBQyxDQUFBIn0=