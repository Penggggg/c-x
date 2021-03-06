"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function watch(ctx, obj) {
    Object.keys(obj).forEach(function (key) {
        defineReactive(ctx.data, key, ctx.data[key], function (value) {
            obj[key].call(ctx, value);
        });
    });
}
exports.watch = watch;
function computed(ctx, obj) {
    var keys = Object.keys(obj);
    var dataKeys = Object.keys(ctx.data);
    dataKeys.forEach(function (dataKey) {
        defineReactive(ctx.data, dataKey, ctx.data[dataKey]);
    });
    var firstComputedObj = keys.reduce(function (prev, next) {
        ctx.data.$target = function () {
            var _a;
            ctx.setData((_a = {}, _a[next] = obj[next].call(ctx), _a));
        };
        prev[next] = obj[next].call(ctx);
        ctx.data.$target = null;
        return prev;
    }, {});
    ctx.setData(firstComputedObj);
}
exports.computed = computed;
function defineReactive(data, key, val, fn) {
    var subs = data['$' + key] || [];
    Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get: function () {
            if (data.$target) {
                subs.push(data.$target);
                data['$' + key] = subs;
            }
            return val;
        },
        set: function (newVal) {
            if (newVal === val)
                return;
            fn && fn(newVal);
            if (subs.length) {
                setTimeout(function () {
                    subs.forEach(function (sub) { return sub(); });
                }, 0);
            }
            val = newVal;
        },
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLFNBQWdCLEtBQUssQ0FBQyxHQUFRLEVBQUUsR0FBUTtJQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7UUFDMUIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsVUFBUyxLQUFVO1lBQzlELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQzNCLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDO0FBTkgsc0JBTUc7QUFFSCxTQUFnQixRQUFRLENBQUMsR0FBUSxFQUFFLEdBQVE7SUFDdkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUMzQixJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNwQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztRQUN0QixjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQ3RELENBQUMsQ0FBQyxDQUFBO0lBQ0YsSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQUMsSUFBUyxFQUFFLElBQUk7UUFDakQsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUc7O1lBQ2pCLEdBQUcsQ0FBQyxPQUFPLFdBQUcsR0FBQyxJQUFJLElBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBRyxDQUFBO1FBQzlDLENBQUMsQ0FBQTtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQTtRQUN2QixPQUFPLElBQUksQ0FBQTtJQUNiLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUNOLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtBQUMvQixDQUFDO0FBZkgsNEJBZUc7QUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUFTLEVBQUUsR0FBUSxFQUFFLEdBQVEsRUFBRSxFQUFRO0lBQzdELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2hDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtRQUMvQixZQUFZLEVBQUUsSUFBSTtRQUNsQixVQUFVLEVBQUUsSUFBSTtRQUNoQixHQUFHLEVBQUU7WUFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUN2QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQTthQUN2QjtZQUNELE9BQU8sR0FBRyxDQUFBO1FBQ1osQ0FBQztRQUNELEdBQUcsRUFBRSxVQUFTLE1BQU07WUFDbEIsSUFBSSxNQUFNLEtBQUssR0FBRztnQkFBRSxPQUFNO1lBQzFCLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDaEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUVmLFVBQVUsQ0FBQztvQkFDVCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBUSxJQUFLLE9BQUEsR0FBRyxFQUFFLEVBQUwsQ0FBSyxDQUFDLENBQUE7Z0JBQ25DLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTthQUNOO1lBQ0QsR0FBRyxHQUFHLE1BQU0sQ0FBQTtRQUNkLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIHdhdGNoKGN0eDogYW55LCBvYmo6IGFueSkge1xuICAgIE9iamVjdC5rZXlzKG9iaikuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgZGVmaW5lUmVhY3RpdmUoY3R4LmRhdGEsIGtleSwgY3R4LmRhdGFba2V5XSwgZnVuY3Rpb24odmFsdWU6IGFueSkge1xuICAgICAgICBvYmpba2V5XS5jYWxsKGN0eCwgdmFsdWUpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cbiAgXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZWQoY3R4OiBhbnksIG9iajogYW55KSB7XG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG4gICAgbGV0IGRhdGFLZXlzID0gT2JqZWN0LmtleXMoY3R4LmRhdGEpXG4gICAgZGF0YUtleXMuZm9yRWFjaChkYXRhS2V5ID0+IHtcbiAgICAgIGRlZmluZVJlYWN0aXZlKGN0eC5kYXRhLCBkYXRhS2V5LCBjdHguZGF0YVtkYXRhS2V5XSlcbiAgICB9KVxuICAgIGxldCBmaXJzdENvbXB1dGVkT2JqID0ga2V5cy5yZWR1Y2UoKHByZXY6IGFueSwgbmV4dCkgPT4ge1xuICAgICAgY3R4LmRhdGEuJHRhcmdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjdHguc2V0RGF0YSh7IFtuZXh0XTogb2JqW25leHRdLmNhbGwoY3R4KSB9KVxuICAgICAgfVxuICAgICAgcHJldltuZXh0XSA9IG9ialtuZXh0XS5jYWxsKGN0eClcbiAgICAgIGN0eC5kYXRhLiR0YXJnZXQgPSBudWxsXG4gICAgICByZXR1cm4gcHJldlxuICAgIH0sIHt9KVxuICAgIGN0eC5zZXREYXRhKGZpcnN0Q29tcHV0ZWRPYmopXG4gIH1cbiAgXG4gIGZ1bmN0aW9uIGRlZmluZVJlYWN0aXZlKGRhdGE6IGFueSwga2V5OiBhbnksIHZhbDogYW55LCBmbj86IGFueSkge1xuICAgIGxldCBzdWJzID0gZGF0YVsnJCcgKyBrZXldIHx8IFtdXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGEsIGtleSwge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChkYXRhLiR0YXJnZXQpIHtcbiAgICAgICAgICBzdWJzLnB1c2goZGF0YS4kdGFyZ2V0KVxuICAgICAgICAgIGRhdGFbJyQnICsga2V5XSA9IHN1YnNcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsXG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbihuZXdWYWwpIHtcbiAgICAgICAgaWYgKG5ld1ZhbCA9PT0gdmFsKSByZXR1cm5cbiAgICAgICAgZm4gJiYgZm4obmV3VmFsKVxuICAgICAgICBpZiAoc3Vicy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyDnlKggc2V0VGltZW91dCDlm6DkuLrmraTml7YgdGhpcy5kYXRhIOi/mOayoeabtOaWsFxuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgc3Vicy5mb3JFYWNoKChzdWI6IGFueSkgPT4gc3ViKCkpXG4gICAgICAgICAgfSwgMClcbiAgICAgICAgfVxuICAgICAgICB2YWwgPSBuZXdWYWxcbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuICBcbiJdfQ==