"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./store/index");
var watch_1 = require("./utils/watch");
var util_1 = require("./utils/util");
var dataBury_1 = require("./utils/dataBury");
App({
    store: index_1.store$,
    watch$: function (key, cb) {
        watch_1.pushCb(key, cb);
        cb(watch_1.getVal(key));
    },
    getUuid$: function () {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, util_1.getUuid()];
                    case 1:
                        id = _a.sent();
                        return [2, id];
                }
            });
        });
    },
    dataBury$: function (data) {
        dataBury_1.default(data);
    },
    set$: function (key, val) {
        watch_1.updateVal(key, val);
        console.log('【---- Property Set ----】', key, ':', val);
    },
    onLaunch: function (obj) {
        var _this = this;
        console.log('我的启动参数', obj);
        index_1.store$.Auth.init();
        index_1.store$.Auth.getSystemInfo();
        index_1.store$.Common.judgeIPhoneX();
        index_1.store$.Cloud
            .initCloud()
            .then(function () {
            index_1.store$.Auth
                .getOpenid()
                .then(function () {
                index_1.store$.Auth.getSystemUser().then(function () {
                    _this.dataBury$([{
                            "$code": "startPage",
                            "$ts": 1567929147302
                        }]);
                    setTimeout(function () {
                        index_1.store$.Auth.bindVisitor();
                        index_1.store$.Auth.judgeMarkerExpand();
                        index_1.store$.Auth.judgeDistributor();
                    }, 100);
                });
            });
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBdUM7QUFDdkMsdUNBQXlFO0FBQ3pFLHFDQUF1QztBQUN2Qyw2Q0FBd0M7QUFFeEMsR0FBRyxDQUFTO0lBR1IsS0FBSyxFQUFFLGNBQU07SUFTYixNQUFNLFlBQUUsR0FBRyxFQUFFLEVBQUU7UUFDWCxjQUFNLENBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBRSxDQUFBO1FBQ2pCLEVBQUUsQ0FBRSxjQUFNLENBQUUsR0FBRyxDQUFFLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBRUssUUFBUTs7Ozs7NEJBQ0UsV0FBTSxjQUFPLEVBQUUsRUFBQTs7d0JBQXJCLEVBQUUsR0FBSSxTQUFlO3dCQUMzQixXQUFPLEVBQUUsRUFBQzs7OztLQUNiO0lBTUQsU0FBUyxZQUFDLElBQUk7UUFDVixrQkFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFTRCxJQUFJLFlBQUUsR0FBRyxFQUFFLEdBQUc7UUFDVixpQkFBUyxDQUFFLEdBQUcsRUFBRSxHQUFHLENBQUUsQ0FBQztRQUN0QixPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFFLENBQUM7SUFDNUQsQ0FBQztJQUVELFFBQVEsWUFBRSxHQUFHO1FBQWIsaUJBMkJDO1FBekJHLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFCLGNBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFHLENBQUM7UUFDcEIsY0FBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUcsQ0FBQztRQUM3QixjQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRyxDQUFDO1FBRTlCLGNBQU0sQ0FBQyxLQUFLO2FBQ1AsU0FBUyxFQUFHO2FBQ1osSUFBSSxDQUFDO1lBQ0YsY0FBTSxDQUFDLElBQUk7aUJBQ04sU0FBUyxFQUFHO2lCQUNaLElBQUksQ0FBQztnQkFDRixjQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRyxDQUFDLElBQUksQ0FBQztvQkFDOUIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzRCQUNaLE9BQU8sRUFBQyxXQUFXOzRCQUNuQixLQUFLLEVBQUMsYUFBYTt5QkFDdEIsQ0FBQyxDQUFDLENBQUM7b0JBRUosVUFBVSxDQUFDO3dCQUNQLGNBQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7d0JBQzNCLGNBQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUcsQ0FBQzt3QkFDakMsY0FBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRyxDQUFDO29CQUNwQyxDQUFDLEVBQUUsR0FBRyxDQUFFLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztDQUNKLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHAgfSBmcm9tICcuL2dsb2JhbCc7XG5pbXBvcnQgeyBzdG9yZSQgfSBmcm9tICcuL3N0b3JlL2luZGV4JztcbmltcG9ydCB7IHdhdGNoQ2FsbEJhY2ssIHB1c2hDYiwgZ2V0VmFsLCB1cGRhdGVWYWwgfSBmcm9tICcuL3V0aWxzL3dhdGNoJztcbmltcG9ydCB7IGdldFV1aWQgfSBmcm9tICcuL3V0aWxzL3V0aWwnO1xuaW1wb3J0IGRhdGFCdXJ5IGZyb20gJy4vdXRpbHMvZGF0YUJ1cnknO1xuXG5BcHA8IElBcHAgPih7XG5cbiAgICAvKiog5YWo5bGAc3RvcmUgKi9cbiAgICBzdG9yZTogc3RvcmUkLFxuXG4gICAgLyoqIFxuICAgICAqIEBkZXNjcmlwdGlvbiBcbiAgICAgKiDnm5HlkKxzdG9yZemHjOmdouafkOWtl+autVxuICAgICAqIOeUqOazle+8mlxuICAgICAqIGNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuICAgICAqIGFwcC53YXRjaCQoJ0F1dGgubmFtZXMuQmVuJywgKCBuZXdWYWwsIG9sZFZhbCApID0+IHsgLi4uLi4gfSlcbiAgICAgKi9cbiAgICB3YXRjaCQoIGtleSwgY2IgKSB7XG4gICAgICAgIHB1c2hDYigga2V5LCBjYiApXG4gICAgICAgIGNiKCBnZXRWYWwoIGtleSApKTtcbiAgICB9LFxuICAgIC8vIOiOt+WPlnV1aWRcbiAgICBhc3luYyBnZXRVdWlkJCggKSB7XG4gICAgICAgIGNvbnN0IGlkID0gIGF3YWl0IGdldFV1aWQoKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiDmlbDmja7ln4vngrlcbiAgICAgKiAqLyBcbiAgICBkYXRhQnVyeSQoZGF0YSl7XG4gICAgICAgIGRhdGFCdXJ5KGRhdGEpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gXG4gICAgICog6K6+572uc3RvcmXph4zpnaLmn5DlrZfmrrVcbiAgICAgKiDnlKjms5XvvJpcbiAgICAgKiBjb25zdCBhcHAgPSBnZXRBcHAoICk7XG4gICAgICogYXBwLnNldCQoJ0F1dGgubmFtZXMuQmVuJywgJ2hlaGVoZScpO1xuICAgICAqL1xuICAgIHNldCQoIGtleSwgdmFsICkge1xuICAgICAgICB1cGRhdGVWYWwoIGtleSwgdmFsICk7XG4gICAgICAgIGNvbnNvbGUubG9nKCfjgJAtLS0tIFByb3BlcnR5IFNldCAtLS0t44CRJywga2V5LCAnOicsIHZhbCApO1xuICAgIH0sXG5cbiAgICBvbkxhdW5jaCggb2JqICkge1xuICAgICAgICAvLyDpobXpnaLln4vngrlcbiAgICAgICAgY29uc29sZS5sb2coJ+aIkeeahOWQr+WKqOWPguaVsCcsb2JqKTtcbiAgICAgICAgc3RvcmUkLkF1dGguaW5pdCggKTtcbiAgICAgICAgc3RvcmUkLkF1dGguZ2V0U3lzdGVtSW5mbyggKTtcbiAgICAgICAgc3RvcmUkLkNvbW1vbi5qdWRnZUlQaG9uZVgoICk7XG5cbiAgICAgICAgc3RvcmUkLkNsb3VkXG4gICAgICAgICAgICAuaW5pdENsb3VkKCApXG4gICAgICAgICAgICAudGhlbigoICkgPT4ge1xuICAgICAgICAgICAgICAgIHN0b3JlJC5BdXRoXG4gICAgICAgICAgICAgICAgICAgIC5nZXRPcGVuaWQoIClcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlJC5BdXRoLmdldFN5c3RlbVVzZXIoICkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhQnVyeSQoW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIkY29kZVwiOlwic3RhcnRQYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiJHRzXCI6MTU2NzkyOTE0NzMwMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDov5nph4znu5nml7bpl7Torr7nva53YS1qd3TnmoTlhajlsYDlpLTpg6hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlJC5BdXRoLmJpbmRWaXNpdG9yKCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZSQuQXV0aC5qdWRnZU1hcmtlckV4cGFuZCggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RvcmUkLkF1dGguanVkZ2VEaXN0cmlidXRvciggKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCAxMDAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH0sXG59KTsiXX0=