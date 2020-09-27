"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** vue-ssr-render */
exports.renderRouter = (app) => {
    const { router, controller } = app;
    if (!!router && !!controller) {
        router.get(/^(?!\/api).*$/, controller.render.index.index);
    }
    return;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm91dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEscUJBQXFCO0FBQ1IsUUFBQSxZQUFZLEdBQUcsQ0FBRSxHQUFnQixFQUFHLEVBQUU7SUFDL0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxHQUFHLENBQUM7SUFDbkMsSUFBSyxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUc7UUFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFFLENBQUM7S0FDL0Q7SUFDRCxPQUFPO0FBQ1gsQ0FBQyxDQUFBIn0=