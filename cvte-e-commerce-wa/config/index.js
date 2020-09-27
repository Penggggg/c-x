"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dev_1 = require("./dev");
var fat_1 = require("./fat");
var uat_1 = require("./uat");
var prod_1 = require("./prod");
var env = 'prod';
var configSet = {
    dev: dev_1.default,
    fat: fat_1.default,
    uat: uat_1.default,
    prod: prod_1.default
};
exports.default = configSet[env];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUF3QjtBQUN4Qiw2QkFBd0I7QUFDeEIsNkJBQXdCO0FBQ3hCLCtCQUEwQjtBQUUxQixJQUFNLEdBQUcsR0FBUyxNQUFNLENBQUM7QUFFekIsSUFBTSxTQUFTLEdBQUc7SUFDZCxHQUFHLGVBQUE7SUFDSCxHQUFHLGVBQUE7SUFDSCxHQUFHLGVBQUE7SUFDSCxJQUFJLGdCQUFBO0NBQ1AsQ0FBQztBQUlGLGtCQUFlLFNBQVMsQ0FBRSxHQUFHLENBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZXYgZnJvbSAnLi9kZXYnO1xuaW1wb3J0IGZhdCBmcm9tICcuL2ZhdCc7XG5pbXBvcnQgdWF0IGZyb20gJy4vdWF0JztcbmltcG9ydCBwcm9kIGZyb20gJy4vcHJvZCc7XG5cbmNvbnN0IGVudjogZW52cyA9ICdwcm9kJztcblxuY29uc3QgY29uZmlnU2V0ID0ge1xuICAgIGRldixcbiAgICBmYXQsXG4gICAgdWF0LFxuICAgIHByb2Rcbn07XG5cbnR5cGUgZW52cyA9ICdkZXYnIHwgJ2ZhdCcgfCAndWF0JyB8ICdwcm9kJztcblxuZXhwb3J0IGRlZmF1bHQgY29uZmlnU2V0WyBlbnYgXTtcblxuIl19