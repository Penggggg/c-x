"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var route_js_1 = require("../../utils/route.js");
var constant_1 = require("../../utils/constant");
var app = getApp();
Component({
    properties: {
        placeholder: {
            type: String,
            value: '发票开票'
        },
        defaultAddress: {
            type: String,
            value: ''
        }
    },
    data: {
        selecting: null,
        dicType: [
            {
                label: '企业',
                value: constant_1.InvoiceChoiceType.company
            }, {
                label: '个人',
                value: constant_1.InvoiceChoiceType.personal
            }, {
                label: '无需',
                value: constant_1.InvoiceChoiceType.noneed
            }
        ],
        dicInvoiceType: [
            {
                label: '普票',
                value: constant_1.InvoiceType.normal
            }, {
                label: '专票',
                value: constant_1.InvoiceType.specail
            }
        ],
    },
    methods: {
        watchApp: function () {
            var _this = this;
            app.watch$('Form.orderInvoice', function (v) {
                !!v && Object.keys(v).length > 0 && _this.onConfirm(v);
            });
        },
        goEdit: function () {
            var this_ = this;
            var _a = this_.data, selecting = _a.selecting, defaultAddress = _a.defaultAddress;
            route_js_1.navTo("/pages/invoice-create/index?editing=" + (!!selecting ? 1 : 0) + "&defaultAddress=" + defaultAddress);
        },
        onConfirm: function (v) {
            var this_ = this;
            var _a = this_.data, dicType = _a.dicType, dicInvoiceType = _a.dicInvoiceType;
            var typeTarget$ = dicType.find(function (x) { return x.value === v.type; });
            var invoiceTypeTarget$ = dicInvoiceType.find(function (x) { return x.value === v.invoiceType; });
            var meta = __assign({}, v, { type$: typeTarget$ ? typeTarget$.label : '', invoiceType$: invoiceTypeTarget$ ? invoiceTypeTarget$.label : '' });
            this_.setData({
                selecting: meta
            });
            this_.triggerEvent('change', v);
        }
    },
    attached: function () {
        this.watchApp();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsaURBQTZDO0FBRzdDLGlEQUFzRTtBQUV0RSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVcsQ0FBQztBQU05QixTQUFTLENBQUM7SUFLTixVQUFVLEVBQUU7UUFFUixXQUFXLEVBQUU7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxNQUFNO1NBQ2hCO1FBR0QsY0FBYyxFQUFFO1lBQ1osSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsRUFBRTtTQUNaO0tBRUo7SUFLRCxJQUFJLEVBQUU7UUFHRixTQUFTLEVBQUUsSUFBSTtRQUdmLE9BQU8sRUFBRTtZQUNMO2dCQUNJLEtBQUssRUFBRSxJQUFJO2dCQUNYLEtBQUssRUFBRSw0QkFBaUIsQ0FBQyxPQUFPO2FBQ25DLEVBQUU7Z0JBQ0MsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsS0FBSyxFQUFFLDRCQUFpQixDQUFDLFFBQVE7YUFDcEMsRUFBRTtnQkFDQyxLQUFLLEVBQUUsSUFBSTtnQkFDWCxLQUFLLEVBQUUsNEJBQWlCLENBQUMsTUFBTTthQUNsQztTQUNKO1FBR0QsY0FBYyxFQUFFO1lBQ1o7Z0JBQ0ksS0FBSyxFQUFFLElBQUk7Z0JBQ1gsS0FBSyxFQUFFLHNCQUFXLENBQUMsTUFBTTthQUM1QixFQUFFO2dCQUNDLEtBQUssRUFBRSxJQUFJO2dCQUNYLEtBQUssRUFBRSxzQkFBVyxDQUFDLE9BQU87YUFDN0I7U0FDSjtLQUVKO0lBS0QsT0FBTyxFQUFFO1FBR0wsUUFBUTtZQUFSLGlCQUlDO1lBSEcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsRUFBRSxVQUFBLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUksQ0FBQyxTQUFTLENBQUUsQ0FBQyxDQUFFLENBQUM7WUFDOUQsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBR0QsTUFBTTtZQUNGLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNsQixJQUFBLGVBQTBDLEVBQXhDLHdCQUFTLEVBQUUsa0NBQTZCLENBQUM7WUFDakQsZ0JBQUssQ0FBQywwQ0FBd0MsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLHlCQUFvQixjQUFnQixDQUFDLENBQUM7UUFDM0csQ0FBQztRQUdELFNBQVMsWUFBRSxDQUFDO1lBQ1IsSUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO1lBQ2xCLElBQUEsZUFBd0MsRUFBdEMsb0JBQU8sRUFBRSxrQ0FBNkIsQ0FBQztZQUUvQyxJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFsQixDQUFrQixDQUFFLENBQUM7WUFDNUQsSUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFFLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsV0FBVyxFQUF6QixDQUF5QixDQUFFLENBQUM7WUFFakYsSUFBTSxJQUFJLGdCQUNILENBQUMsSUFDSixLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQzNDLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQ25FLENBQUM7WUFFRixLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUNWLFNBQVMsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQztZQUNILEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBRSxDQUFDO1FBQ3JDLENBQUM7S0FFSjtJQUVELFFBQVEsRUFBRTtRQUNOLElBQUksQ0FBQyxRQUFRLEVBQUcsQ0FBQztJQUNyQixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgeyBJbnZvaWNlQ2hvaWNlVHlwZSwgSW52b2ljZVR5cGUgfSBmcm9tICcuLi8uLi91dGlscy9jb25zdGFudCc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDwgSUFwcCA+KCApO1xuXG4vKipcbiAqIEBkZXNjcmlwdGlvblxuICog6K6i5Y2VIC0g5Y+R56Wo5aGr5YaZXG4gKi9cbkNvbXBvbmVudCh7XG5cbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTlsZ7mgKfliJfooahcbiAgICAgKi9cbiAgICBwcm9wZXJ0aWVzOiB7XG5cbiAgICAgICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAn5Y+R56Wo5byA56WoJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDpu5jorqTnmoTmlLbotKflnLDlnYAgKi9cbiAgICAgICAgZGVmYXVsdEFkZHJlc3M6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnJ1xuICAgICAgICB9XG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgLyoqIOmAieS4rSAqL1xuICAgICAgICBzZWxlY3Rpbmc6IG51bGwsXG5cbiAgICAgICAgLyoqIOaemuS4viAtIOWPkeelqOexu+WeiyAqL1xuICAgICAgICBkaWNUeXBlOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfkvIHkuJonLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBJbnZvaWNlQ2hvaWNlVHlwZS5jb21wYW55XG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgbGFiZWw6ICfkuKrkuronLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBJbnZvaWNlQ2hvaWNlVHlwZS5wZXJzb25hbFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5peg6ZyAJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogSW52b2ljZUNob2ljZVR5cGUubm9uZWVkXG4gICAgICAgICAgICB9XG4gICAgICAgIF0sXG5cbiAgICAgICAgLyoqIOaemuS4viAtIOS4k+elqC/mma7npaggKi9cbiAgICAgICAgZGljSW52b2ljZVR5cGU6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBsYWJlbDogJ+aZruelqCcsXG4gICAgICAgICAgICAgICAgdmFsdWU6IEludm9pY2VUeXBlLm5vcm1hbFxuICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgIGxhYmVsOiAn5LiT56WoJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogSW52b2ljZVR5cGUuc3BlY2FpbFxuICAgICAgICAgICAgfVxuICAgICAgICBdLFxuXG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog57uE5Lu255qE5pa55rOV5YiX6KGoXG4gICAgICovXG4gICAgbWV0aG9kczoge1xuXG4gICAgICAgIC8qKiDnm5HlkKwgKi9cbiAgICAgICAgd2F0Y2hBcHAoICkge1xuICAgICAgICAgICAgYXBwLndhdGNoJCgnRm9ybS5vcmRlckludm9pY2UnLCB2ID0+IHtcbiAgICAgICAgICAgICAgICAhIXYgJiYgT2JqZWN0LmtleXMoIHYgKS5sZW5ndGggPiAwICYmIHRoaXMub25Db25maXJtKCB2ICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog6Lez5Yiw6K6i5Y2V5Yib5bu66aG16Z2iICovXG4gICAgICAgIGdvRWRpdCggKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IHsgc2VsZWN0aW5nLCBkZWZhdWx0QWRkcmVzcyB9ID0gdGhpc18uZGF0YTtcbiAgICAgICAgICAgIG5hdlRvKGAvcGFnZXMvaW52b2ljZS1jcmVhdGUvaW5kZXg/ZWRpdGluZz0keyAhIXNlbGVjdGluZyA/IDEgOiAwIH0mZGVmYXVsdEFkZHJlc3M9JHtkZWZhdWx0QWRkcmVzc31gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog6KGo5Y2V5aGr5YaZ5a6M5oiQICovXG4gICAgICAgIG9uQ29uZmlybSggdiApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyBkaWNUeXBlLCBkaWNJbnZvaWNlVHlwZSB9ID0gdGhpc18uZGF0YTtcblxuICAgICAgICAgICAgY29uc3QgdHlwZVRhcmdldCQgPSBkaWNUeXBlLmZpbmQoIHggPT4geC52YWx1ZSA9PT0gdi50eXBlICk7XG4gICAgICAgICAgICBjb25zdCBpbnZvaWNlVHlwZVRhcmdldCQgPSBkaWNJbnZvaWNlVHlwZS5maW5kKCB4ID0+IHgudmFsdWUgPT09IHYuaW52b2ljZVR5cGUgKTtcblxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IHtcbiAgICAgICAgICAgICAgICAuLi52LFxuICAgICAgICAgICAgICAgIHR5cGUkOiB0eXBlVGFyZ2V0JCA/IHR5cGVUYXJnZXQkLmxhYmVsIDogJycsXG4gICAgICAgICAgICAgICAgaW52b2ljZVR5cGUkOiBpbnZvaWNlVHlwZVRhcmdldCQgPyBpbnZvaWNlVHlwZVRhcmdldCQubGFiZWwgOiAnJyxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHNlbGVjdGluZzogbWV0YVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzXy50cmlnZ2VyRXZlbnQoJ2NoYW5nZScsIHYgKTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgIHRoaXMud2F0Y2hBcHAoICk7XG4gICAgfVxufSlcbiAgIl19