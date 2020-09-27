"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_js_1 = require("../../utils/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
var index_1 = require("../../config/index");
Component({
    properties: {
        url: {
            type: String,
            value: index_1.default.host.default + "/apis/common/address"
        },
        query: {
            type: String,
            value: 'parentCode'
        },
        listKey: {
            type: String,
            value: 'list'
        },
        labelKey: {
            type: String,
            value: 'areaName'
        },
        valueKey: {
            type: String,
            value: 'areaCode'
        },
        parentKey: {
            type: String,
            value: 'parentCode'
        },
        columns: {
            type: Number,
            value: 3
        },
        placeholder: {
            type: String,
            value: '请选择地址'
        },
        defaultValue: {
            type: Array,
            value: [],
            observer: 'initByDefault'
        },
        initData: {
            type: Boolean,
            value: true
        }
    },
    data: {
        optArr: [],
        answerArr: [],
        sureAnswerArr: []
    },
    methods: {
        runComputed: function () {
            index_js_1.computed(this, {
                answerText$: function () {
                    var text = '';
                    var this_ = this;
                    var sureAnswerArr = this_.data.sureAnswerArr;
                    sureAnswerArr.map(function (x) { return text += " " + x.label; });
                    return text;
                }
            });
        },
        fetchNext: function (code, index, autoNext) {
            var _this = this;
            if (code === void 0) { code = ''; }
            if (index === void 0) { index = 0; }
            if (autoNext === void 0) { autoNext = false; }
            var this_ = this;
            var _a = this_.data, listKey = _a.listKey, optArr = _a.optArr, columns = _a.columns, url = _a.url, query = _a.query;
            if (index >= columns) {
                return;
            }
            return http_js_1.http({
                allUrl: url + "?" + (code ? query + "=" + code : '') + "&" + (code === '' ? 'level=1' : '') + "&pageSize=999&isChina=1"
            }).then(function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return;
                }
                var list = listKey ? data[listKey] : data;
                var dealMeta = _this.dealListMeta(list);
                optArr.splice(index, 1, dealMeta);
                this_.setData({
                    optArr: optArr
                });
                if (autoNext && index < columns - 1 && dealMeta.length > 0) {
                    _this.fetchNext(dealMeta[0].value, index + 1, true);
                }
                return dealMeta;
            });
        },
        dealListMeta: function (item) {
            var this_ = this;
            var _a = this_.data, valueKey = _a.valueKey, labelKey = _a.labelKey, parentKey = _a.parentKey;
            return item
                .map(function (i) { return ({
                value: i[valueKey],
                label: i[labelKey],
                parentCode: i[parentKey]
            }); })
                .filter(function (i) {
                return !i.label.includes('台湾') &&
                    !i.label.includes('香港') &&
                    !i.label.includes('澳门');
            });
        },
        initAnswer: function () {
            var this_ = this;
            var columns = this_.data.columns;
            var arr = [];
            for (var i = 0; i < columns; i++) {
                arr.push(0);
            }
            this_.setData({
                answerArr: arr
            });
        },
        onPickerChange: function (e) {
            var this_ = this;
            var _a = this_.data, answerArr = _a.answerArr, optArr = _a.optArr;
            var sureAnswerArr = answerArr.map(function (columnAnswer, index) {
                var target = optArr[index][columnAnswer];
                return target || {};
            });
            this_.setData({
                sureAnswerArr: sureAnswerArr
            });
            this_.triggerEvent('change', sureAnswerArr);
        },
        onColumnChange: function (e) {
            var this_ = this;
            var _a = e.detail, column = _a.column, value = _a.value;
            var _b = this_.data, optArr = _b.optArr, columns = _b.columns;
            var answerArr = this_.data.answerArr.slice();
            answerArr.splice(column, 1, value);
            var newAnswerArr = answerArr.slice(0, column + 1);
            for (var i = column + 1; i < columns; i++) {
                newAnswerArr.push(0);
            }
            this_.setData({
                answerArr: newAnswerArr
            });
            var current = optArr[column][value];
            this.fetchNext(current.value, column + 1, true);
        },
        initByDefault: function (v) {
            var _this = this;
            if (Array.isArray(v) && v.length === 0) {
                return;
            }
            var this_ = this;
            var _a = this_.data, labelKey = _a.labelKey, valueKey = _a.valueKey, sureAnswerArr = _a.sureAnswerArr, columns = _a.columns;
            var defaultValueArr = v.map(function (x) { return ({
                label: x[labelKey] || x.label,
                value: x[valueKey] || x.value
            }); });
            this_.setData({
                sureAnswerArr: defaultValueArr
            });
            defaultValueArr.slice(0, defaultValueArr.length - 1);
            var someDifferent = sureAnswerArr.some(function (item, k) {
                return typeof item !== 'object' || item.value !== defaultValueArr[k].value;
            });
            if (!someDifferent && sureAnswerArr.length === defaultValueArr.length) {
                return;
            }
            Promise.all([
                this.fetchNext('')
            ].concat(defaultValueArr
                .slice(0, defaultValueArr.length - 1)
                .map(function (defaultValueMeta, index) {
                return _this.fetchNext(defaultValueMeta.value, index + 1);
            }))).then(function (res) {
                setTimeout(function () {
                    var answerArr = defaultValueArr.map(function (defaultValueMeta, index) {
                        var targeIndex = res[index].findIndex(function (x) { return x.value === defaultValueMeta.value; });
                        return targeIndex === -1 ? 0 : targeIndex;
                    });
                    this_.setData({
                        answerArr: answerArr,
                        optArr: res
                    });
                }, 100);
            });
        }
    },
    attached: function () {
        var _a = this.data, defaultValue = _a.defaultValue, initData = _a.initData;
        this.runComputed();
        this.initAnswer();
        if (initData && defaultValue.length === 0) {
            this.fetchNext('', 0, true);
        }
        else {
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLCtDQUEyQztBQUMzQyxxREFBb0Q7QUFDcEQsNENBQXdDO0FBTXhDLFNBQVMsQ0FBQztJQUtOLFVBQVUsRUFBRTtRQUdSLEdBQUcsRUFBRTtZQUNELElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFLLGVBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyx5QkFBc0I7U0FDdEQ7UUFHRCxLQUFLLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxZQUFZO1NBQ3RCO1FBR0QsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsTUFBTTtTQUNoQjtRQUdELFFBQVEsRUFBRTtZQUNOLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLFVBQVU7U0FDcEI7UUFHRCxRQUFRLEVBQUU7WUFDTixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxVQUFVO1NBQ3BCO1FBR0QsU0FBUyxFQUFFO1lBQ1AsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsWUFBWTtTQUN0QjtRQUdELE9BQU8sRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLENBQUM7U0FDWDtRQUdELFdBQVcsRUFBRTtZQUNULElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLE9BQU87U0FDakI7UUFTRCxZQUFZLEVBQUU7WUFDVixJQUFJLEVBQUUsS0FBSztZQUNYLEtBQUssRUFBRSxFQUFHO1lBQ1YsUUFBUSxFQUFFLGVBQWU7U0FDNUI7UUFLRCxRQUFRLEVBQUU7WUFDTixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxJQUFJO1NBQ2Q7S0FDSjtJQUtELElBQUksRUFBRTtRQVVGLE1BQU0sRUFBRSxFQUFHO1FBTVgsU0FBUyxFQUFFLEVBQUc7UUFVZCxhQUFhLEVBQUUsRUFBRztL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QUFTLENBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxLQUFLLGdCQUFnQixDQUFDLEtBQUssRUFBbEMsQ0FBa0MsQ0FBRSxDQUFDO3dCQUNyRixPQUFPLFVBQVUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUE7b0JBQzdDLENBQUMsQ0FBQyxDQUFDO29CQUVILEtBQUssQ0FBQyxPQUFPLENBQUM7d0JBQ1YsU0FBUyxXQUFBO3dCQUNULE1BQU0sRUFBRSxHQUFHO3FCQUNkLENBQUMsQ0FBQztnQkFDUCxDQUFDLEVBQUUsR0FBRyxDQUFFLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FFSjtJQUVELFFBQVEsRUFBRTtRQUVBLElBQUEsY0FBc0MsRUFBcEMsOEJBQVksRUFBRSxzQkFBc0IsQ0FBQztRQUU3QyxJQUFJLENBQUMsV0FBVyxFQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLFVBQVUsRUFBRyxDQUFDO1FBQ25CLElBQUssUUFBUSxJQUFJLFlBQVksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFHO1lBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUUsQ0FBQztTQUNqQzthQUFNO1NBR047SUFDTCxDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4uLy4uL2NvbmZpZy9pbmRleCc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiDnnIHluILljLrpgInmi6lcbiAqL1xuQ29tcG9uZW50KHtcblxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOWxnuaAp+WIl+ihqFxuICAgICAqL1xuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvKiog6K+35rGC5Zyw5Z2AICovXG4gICAgICAgIHVybDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6IGAke2NvbmZpZy5ob3N0LmRlZmF1bHR9L2FwaXMvY29tbW9uL2FkZHJlc3NgXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOivt+axgnF1ZXJ5IHBhcmVudENvZGUgKi9cbiAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAncGFyZW50Q29kZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDojrflj5bmlbDmja7lkI7vvIzku47lk6rkuKrlrZfmrrXojrflvpfliJfooahcbiAgICAgICAgbGlzdEtleToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICdsaXN0J1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIOWFg+aVsOaNrueahOS4reaWh+Wtl+autVxuICAgICAgICBsYWJlbEtleToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICdhcmVhTmFtZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDlhYPmlbDmja7nmoTlgLzlrZfmrrVcbiAgICAgICAgdmFsdWVLZXk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAnYXJlYUNvZGUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8g5YWD5pWw5o2ucGFyZW50Q29kZeWAvOWtl+autVxuICAgICAgICBwYXJlbnRLZXk6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAncGFyZW50Q29kZSdcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDlh6DooYzpgInmi6lcbiAgICAgICAgY29sdW1uczoge1xuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxuICAgICAgICAgICAgdmFsdWU6IDNcbiAgICAgICAgfSxcblxuICAgICAgICAvLyDpu5jorqTmlofmoYhcbiAgICAgICAgcGxhY2Vob2xkZXI6IHtcbiAgICAgICAgICAgIHR5cGU6IFN0cmluZyxcbiAgICAgICAgICAgIHZhbHVlOiAn6K+36YCJ5oup5Zyw5Z2AJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiBcbiAgICAgICAgICog6buY6K6k5YC8XG4gICAgICAgICAqIHtcbiAgICAgICAgICogICAgICBhcmVhTmFtZTogc3RyaW5nLFxuICAgICAgICAgKiAgICAgIGFyZWFDb2RlOiBzdHJpbmdcbiAgICAgICAgICogfVsgXVxuICAgICAgICAgKi9cbiAgICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgICAgICB0eXBlOiBBcnJheSxcbiAgICAgICAgICAgIHZhbHVlOiBbIF0sXG4gICAgICAgICAgICBvYnNlcnZlcjogJ2luaXRCeURlZmF1bHQnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOaYr+WQpuaLieWPluWIneWni+WMluaVsOaNrlxuICAgICAgICAgKi9cbiAgICAgICAgaW5pdERhdGE6IHtcbiAgICAgICAgICAgIHR5cGU6IEJvb2xlYW4sXG4gICAgICAgICAgICB2YWx1ZTogdHJ1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgXG4gICAgLyoqXG4gICAgICog57uE5Lu255qE5Yid5aeL5pWw5o2uXG4gICAgICovXG4gICAgZGF0YToge1xuXG4gICAgICAgIC8qKiBcbiAgICAgICAgICog5Y+v6YCJ5YiX6KGoIFxuICAgICAgICAgKiB7XG4gICAgICAgICAqICAgICAgbGFiZWw6IHN0cmluZyxcbiAgICAgICAgICogICAgICB2YWx1ZTogc3RyaW5nLFxuICAgICAgICAgKiAgICAgIHBhcmVudENvZGU6IHN0cmluZ1xuICAgICAgICAgKiB9WyBdWyBdIFxuICAgICAgICAgKi9cbiAgICAgICAgb3B0QXJyOiBbIF0sXG5cbiAgICAgICAgLyoqIFxuICAgICAgICAgKiDlt7LpgInliJfooahcbiAgICAgICAgICogbnVtYmVyWyBdXG4gICAgICAgICAqL1xuICAgICAgICBhbnN3ZXJBcnI6IFsgXSxcblxuICAgICAgICAvKiogXG4gICAgICAgICAqIOehruWumuWQjueahOmAiemhuVxuICAgICAgICAgKiB7XG4gICAgICAgICAqICAgICAgbGFiZWw6IHN0cmluZyxcbiAgICAgICAgICogICAgICB2YWx1ZTogc3RyaW5nLFxuICAgICAgICAgKiAgICAgIHBhcmVudENvZGU/OiBzdHJpbmdcbiAgICAgICAgICogfVsgXVxuICAgICAgICAgKi9cbiAgICAgICAgc3VyZUFuc3dlckFycjogWyBdXG5cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTmlrnms5XliJfooahcbiAgICAgKi9cbiAgICBtZXRob2RzOiB7XG5cbiAgICAgICAgLyoqIOiuoeeul+WxnuaApyAqL1xuICAgICAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAgICAgLyoqIOW9k+WJjeW3sumAieeahOS4reaWhyAqL1xuICAgICAgICAgICAgICAgIGFuc3dlclRleHQkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0ID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHN1cmVBbnN3ZXJBcnIgfSA9IHRoaXNfLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHN1cmVBbnN3ZXJBcnIubWFwKCB4ID0+IHRleHQgKz0gYCAke3gubGFiZWx9YCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDmoLnmja7nnIHjgIHluILjgIHljLrjgIHooZfpgZMgKi9cbiAgICAgICAgZmV0Y2hOZXh0KCBjb2RlID0gJycsIGluZGV4ID0gMCwgYXV0b05leHQgPSBmYWxzZSApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyBsaXN0S2V5LCBvcHRBcnIsIGNvbHVtbnMsIHVybCwgcXVlcnkgfSA9IHRoaXNfLmRhdGE7XG5cbiAgICAgICAgICAgIGlmICggaW5kZXggPj0gY29sdW1ucyApIHsgcmV0dXJuOyB9XG5cbiAgICAgICAgICAgIHJldHVybiBodHRwKHtcbiAgICAgICAgICAgICAgICBhbGxVcmw6IGAke3VybH0/JHtjb2RlID8gYCR7cXVlcnl9PWAgKyBjb2RlIDogJyd9JiR7Y29kZSA9PT0gJycgPyAnbGV2ZWw9MScgOiAnJ30mcGFnZVNpemU9OTk5JmlzQ2hpbmE9MWBcbiAgICAgICAgICAgIH0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMsIGRhdGEgfSA9IHJlcztcbiAgICAgICAgICAgICAgICBpZiAoIHN0YXR1cyAhPT0gMjAwICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBsaXN0S2V5ID8gZGF0YVsgbGlzdEtleSBdIDogZGF0YTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWFsTWV0YSA9IHRoaXMuZGVhbExpc3RNZXRhKCBsaXN0ICk7XG5cbiAgICAgICAgICAgICAgICBvcHRBcnIuc3BsaWNlKCBpbmRleCwgMSwgZGVhbE1ldGEgKTtcbiAgICAgICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgb3B0QXJyXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGF1dG9OZXh0ICYmIGluZGV4IDwgY29sdW1ucyAtIDEgJiYgZGVhbE1ldGEubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mZXRjaE5leHQoIGRlYWxNZXRhWyAwIF0udmFsdWUsIGluZGV4ICsgMSwgdHJ1ZSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBkZWFsTWV0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDlpITnkIbliJfooajmlbDmja7vvIzlj5jmiJDpgInpobkgKi9cbiAgICAgICAgZGVhbExpc3RNZXRhKCBpdGVtICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IHZhbHVlS2V5LCBsYWJlbEtleSwgcGFyZW50S2V5IH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gaXRlbVxuICAgICAgICAgICAgICAgIC5tYXAoIGkgPT4gKHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGlbIHZhbHVlS2V5IF0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpWyBsYWJlbEtleSBdLFxuICAgICAgICAgICAgICAgICAgICBwYXJlbnRDb2RlOiBpWyBwYXJlbnRLZXkgXVxuICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoIGkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWkubGFiZWwuaW5jbHVkZXMoJ+WPsOa5vicpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAhaS5sYWJlbC5pbmNsdWRlcygn6aaZ5rivJykgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICFpLmxhYmVsLmluY2x1ZGVzKCfmvrPpl6gnKVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIDtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5Yid5aeL5YyW562U5qGIICovXG4gICAgICAgIGluaXRBbnN3ZXIoICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IGNvbHVtbnMgfSA9IHRoaXNfLmRhdGE7XG5cbiAgICAgICAgICAgIGxldCBhcnI6IG51bWJlclsgXSA9IFsgXTtcbiAgICAgICAgICAgIGZvciggbGV0IGkgPSAwOyBpIDwgY29sdW1uczsgaSsrICkge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKCAwICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBhbnN3ZXJBcnI6IGFyclxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIHBpY2tlcuabtOaUuSwg6L+U5Zue5LqG5pWw57uE562U5qGIICovXG4gICAgICAgIG9uUGlja2VyQ2hhbmdlKCBlICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IGFuc3dlckFyciwgb3B0QXJyIH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBzdXJlQW5zd2VyQXJyID0gYW5zd2VyQXJyLm1hcCgoIGNvbHVtbkFuc3dlciwgaW5kZXggKSA9PntcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBvcHRBcnJbIGluZGV4IF1bIGNvbHVtbkFuc3dlciBdO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQgfHwgeyB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHN1cmVBbnN3ZXJBcnJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzXy50cmlnZ2VyRXZlbnQoJ2NoYW5nZScsIHN1cmVBbnN3ZXJBcnIgKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5p+Q6KGM5pS55Y+Y5LqGICovXG4gICAgICAgIG9uQ29sdW1uQ2hhbmdlKCBlICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICBjb25zdCB7IGNvbHVtbiwgdmFsdWUgfSA9IGUuZGV0YWlsO1xuICAgICAgICAgICAgY29uc3QgeyBvcHRBcnIsIGNvbHVtbnMgfSA9IHRoaXNfLmRhdGE7XG4gICAgICAgICAgICBjb25zdCBhbnN3ZXJBcnIgPSBbIC4uLnRoaXNfLmRhdGEuYW5zd2VyQXJyIF07XG4gICAgICAgICAgICBhbnN3ZXJBcnIuc3BsaWNlKCBjb2x1bW4sIDEsIHZhbHVlICk7XG5cbiAgICAgICAgICAgIC8vIOetlOahiOWPmFxuICAgICAgICAgICAgY29uc3QgbmV3QW5zd2VyQXJyOiBhbnkgPSBhbnN3ZXJBcnIuc2xpY2UoIDAsIGNvbHVtbiArIDEgKTtcbiAgICAgICAgICAgIGZvciggbGV0IGkgPSBjb2x1bW4gKyAxOyBpIDwgY29sdW1uczsgaSsrICkge1xuICAgICAgICAgICAgICAgIG5ld0Fuc3dlckFyci5wdXNoKCAwICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIGFuc3dlckFycjogbmV3QW5zd2VyQXJyXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8g6YCJ6aG55Y+YXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gb3B0QXJyWyBjb2x1bW4gXVsgdmFsdWUgXTtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hOZXh0KCBjdXJyZW50LnZhbHVlLCBjb2x1bW4gKyAxLCB0cnVlICk7XG5cbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5qC55o2u6buY6K6k5YC8IOWkhOeQhuaVsOaNriAqL1xuICAgICAgICBpbml0QnlEZWZhdWx0KCB2ICkge1xuICAgICAgICAgICAgaWYgKCBBcnJheS5pc0FycmF5KCB2ICkgJiYgdi5sZW5ndGggPT09IDAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IHsgbGFiZWxLZXksIHZhbHVlS2V5LCBzdXJlQW5zd2VyQXJyLCBjb2x1bW5zIH0gPSB0aGlzXy5kYXRhO1xuICAgICAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlQXJyID0gdi5tYXAoIHggPT4gKHtcbiAgICAgICAgICAgICAgICBsYWJlbDogeFsgbGFiZWxLZXkgXSB8fCB4LmxhYmVsLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB4WyB2YWx1ZUtleSBdIHx8IHgudmFsdWVcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICAgICAgLy8g6K6+572u5bey6YCJ6aG5XG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBzdXJlQW5zd2VyQXJyOiBkZWZhdWx0VmFsdWVBcnJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBkZWZhdWx0VmFsdWVBcnIuc2xpY2UoIDAsIGRlZmF1bHRWYWx1ZUFyci5sZW5ndGggLSAxICk7XG5cbiAgICAgICAgICAgIC8vIOajgOafpeavj+mhueeahOWAvCDmmK/lkKbnm7jnrYlcbiAgICAgICAgICAgIGNvbnN0IHNvbWVEaWZmZXJlbnQgPSBzdXJlQW5zd2VyQXJyLnNvbWUoKCBpdGVtLCBrICkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgaXRlbSAhPT0gJ29iamVjdCcgfHwgaXRlbS52YWx1ZSAhPT0gZGVmYXVsdFZhbHVlQXJyWyBrIF0udmFsdWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKCAhc29tZURpZmZlcmVudCAmJiBzdXJlQW5zd2VyQXJyLmxlbmd0aCA9PT0gZGVmYXVsdFZhbHVlQXJyLmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOaLieWPluecgeW4guWMulxuICAgICAgICAgICAgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgICAgIC8vIOecgVxuICAgICAgICAgICAgICAgIHRoaXMuZmV0Y2hOZXh0KCAnJyApLFxuICAgICAgICAgICAgICAgIC8vIOW4guOAgeWMuuOAgeihl+mBk+etiVxuICAgICAgICAgICAgICAgIC4uLmRlZmF1bHRWYWx1ZUFyclxuICAgICAgICAgICAgICAgICAgICAuc2xpY2UoIDAsIGRlZmF1bHRWYWx1ZUFyci5sZW5ndGggLSAxIClcbiAgICAgICAgICAgICAgICAgICAgLm1hcCgoIGRlZmF1bHRWYWx1ZU1ldGEsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZmV0Y2hOZXh0KCBkZWZhdWx0VmFsdWVNZXRhLnZhbHVlLCBpbmRleCArIDEgKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0pLnRoZW4oIHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gIeacieaXtuWAmeS8muaKpSBvcHRBcnJbIGluZGV4IF0gdW5kZWZpZW5kXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyDorr7nva7lt7LpgInlgLxcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYW5zd2VyQXJyID0gZGVmYXVsdFZhbHVlQXJyLm1hcCgoIGRlZmF1bHRWYWx1ZU1ldGEsIGluZGV4ICkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2VJbmRleCA9IHJlc1sgaW5kZXggXS5maW5kSW5kZXgoIHggPT4geC52YWx1ZSA9PT0gZGVmYXVsdFZhbHVlTWV0YS52YWx1ZSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdlSW5kZXggPT09IC0xID8gMCA6IHRhcmdlSW5kZXhcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbnN3ZXJBcnIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRBcnI6IHJlc1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAxMDAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9LFxuXG4gICAgYXR0YWNoZWQ6IGZ1bmN0aW9uKCApIHtcblxuICAgICAgICBjb25zdCB7IGRlZmF1bHRWYWx1ZSwgaW5pdERhdGEgfSA9IHRoaXMuZGF0YTtcblxuICAgICAgICB0aGlzLnJ1bkNvbXB1dGVkKCApO1xuICAgICAgICB0aGlzLmluaXRBbnN3ZXIoICk7XG4gICAgICAgIGlmICggaW5pdERhdGEgJiYgZGVmYXVsdFZhbHVlLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAgIHRoaXMuZmV0Y2hOZXh0KCAnJywgMCwgdHJ1ZSApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8g6L+Z6YeM5LiN55So77yM5Zug5Li65LiK6Z2iIG9ic2VydmVy5LqGXG4gICAgICAgICAgICAvLyB0aGlzLmluaXRCeURlZmF1bHQoICk7XG4gICAgICAgIH1cbiAgICB9XG59KVxuICAiXX0=