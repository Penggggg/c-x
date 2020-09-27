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
var http_js_1 = require("../../utils/http.js");
var index_js_1 = require("../../lib/vuefy/index.js");
Component({
    properties: {
        url: {
            type: String,
            value: ''
        },
        query: {
            type: String,
            value: 'keyword'
        },
        max: {
            type: Number,
            value: 5
        },
        showKey: {
            type: String,
            value: 'name'
        },
        fillKey: {
            type: String,
            value: 'name'
        },
        disabled: {
            type: Boolean,
            value: false
        },
        defaultValue: {
            type: String,
            value: '',
            observer: 'initVal'
        },
        placeholder: {
            type: String,
            value: ''
        }
    },
    data: {
        value: '',
        isShow: false,
        timer: null,
        resultList: []
    },
    methods: {
        runComputed: function () {
            index_js_1.computed(this, {
                resultList$: function () {
                    var _a = this.data, resultList = _a.resultList, value = _a.value;
                    var showKey = this.data.showKey || 'name';
                    var showKeyArr = showKey.split(',');
                    var value$ = value ?
                        value.replace(/ /g, '') :
                        '';
                    var meta = resultList.map(function (item) {
                        return __assign({}, item, { showKeyArr$: showKeyArr.map(function (key) {
                                var allText = item[key];
                                if (!allText) {
                                    return [{
                                            text: '',
                                            type: 'normal'
                                        }];
                                }
                                else {
                                    var index = allText.indexOf(value$);
                                    return [{
                                            type: 'normal',
                                            text: allText.slice(0, index)
                                        }, {
                                            type: 'bold',
                                            text: allText.slice(index, value$.length)
                                        }, {
                                            type: 'normal',
                                            text: allText.slice(index + value$.length)
                                        }];
                                }
                            }) });
                    });
                    return meta;
                }
            });
        },
        onInput: function (_a) {
            var detail = _a.detail;
            var this_ = this;
            var value = detail.value;
            this_.setData({
                value: value
            });
            this_.triggerEvent('input', value);
            this.beforeSearch(value.replace(/ /g, ''));
        },
        beforeSearch: function (search) {
            var _this = this;
            var this_ = this;
            var _a = this_.data, url = _a.url, timer = _a.timer;
            if (!url || !search) {
                return;
            }
            if (timer) {
                clearTimeout(timer);
            }
            this_.setData({
                timer: setTimeout(function () {
                    _this.onSearch(search);
                }, 500)
            });
        },
        onSearch: function (search) {
            var this_ = this;
            var _a = this_.data, url = _a.url, query = _a.query, max = _a.max;
            http_js_1.http({
                errMsg: 'none',
                loadingMsg: 'none',
                path: "/apis/common/company-check?" + (query || 'keyword') + "=" + search
            }).then(function (res) {
                var status = res.status, data = res.data;
                if (status !== 200) {
                    return this_.setData({
                        isShow: false,
                        resultList: []
                    });
                }
                this_.setData({
                    isShow: true,
                    resultList: Array.isArray(data) ?
                        data.slice(0, max) :
                        []
                });
            });
        },
        onSetShow: function (isShow) {
            var this_ = this;
            this_.setData({
                isShow: isShow
            });
        },
        onBlur: function () {
            var _this = this;
            setTimeout(function () {
                _this.onSetShow(false);
            }, 100);
        },
        onFocus: function () {
            this.onSetShow(true);
        },
        onChoice: function (_a) {
            var currentTarget = _a.currentTarget;
            var this_ = this;
            var fillKey = this_.data.fillKey || 'name';
            var item = currentTarget.dataset.item;
            if (!fillKey) {
                return;
            }
            if (item[fillKey] === undefined) {
                return;
            }
            this_.setData({
                value: item[fillKey]
            });
            this_.triggerEvent('confirm', item);
        },
        initVal: function (v) {
            var this_ = this;
            this_.setData({
                value: v
            });
        }
    },
    attached: function () {
        this.runComputed();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EsK0NBQTJDO0FBQzNDLHFEQUFvRDtBQU1wRCxTQUFTLENBQUM7SUFLTixVQUFVLEVBQUU7UUFHUixHQUFHLEVBQUU7WUFDRCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxFQUFFO1NBQ1o7UUFHRCxLQUFLLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxTQUFTO1NBQ25CO1FBR0QsR0FBRyxFQUFFO1lBQ0QsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsQ0FBQztTQUNYO1FBR0QsT0FBTyxFQUFFO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixLQUFLLEVBQUUsTUFBTTtTQUNoQjtRQUdELE9BQU8sRUFBRTtZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLE1BQU07U0FDaEI7UUFHRCxRQUFRLEVBQUU7WUFDTixJQUFJLEVBQUUsT0FBTztZQUNiLEtBQUssRUFBRSxLQUFLO1NBQ2Y7UUFHRCxZQUFZLEVBQUU7WUFDVixJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxFQUFFO1lBQ1QsUUFBUSxFQUFFLFNBQVM7U0FDdEI7UUFHRCxXQUFXLEVBQUU7WUFDVCxJQUFJLEVBQUUsTUFBTTtZQUNaLEtBQUssRUFBRSxFQUFFO1NBQ1o7S0FDSjtJQUtELElBQUksRUFBRTtRQUdGLEtBQUssRUFBRSxFQUFFO1FBR1QsTUFBTSxFQUFFLEtBQUs7UUFHYixLQUFLLEVBQUUsSUFBSTtRQUdYLFVBQVUsRUFBRSxFQUFHO0tBRWxCO0lBS0QsT0FBTyxFQUFFO1FBRUwsV0FBVztZQUNQLG1CQUFRLENBQUUsSUFBSSxFQUFFO2dCQUdaLFdBQVcsRUFBRTtvQkFDSCxJQUFBLGNBQWlDLEVBQS9CLDBCQUFVLEVBQUUsZ0JBQW1CLENBQUM7b0JBQ3hDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQztvQkFDNUMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7d0JBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLEVBQUUsQ0FBQztvQkFFUCxJQUFNLElBQUksR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFFLFVBQUEsSUFBSTt3QkFDN0Isb0JBQ08sSUFBSSxJQUNQLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFFLFVBQUEsR0FBRztnQ0FDNUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFFLEdBQUcsQ0FBRSxDQUFDO2dDQUM1QixJQUFLLENBQUMsT0FBTyxFQUFHO29DQUNaLE9BQU8sQ0FBQzs0Q0FDSixJQUFJLEVBQUUsRUFBRTs0Q0FDUixJQUFJLEVBQUUsUUFBUTt5Q0FDakIsQ0FBQyxDQUFBO2lDQUNMO3FDQUFNO29DQUNILElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUUsTUFBTSxDQUFFLENBQUM7b0NBQ3hDLE9BQU8sQ0FBQzs0Q0FDSixJQUFJLEVBQUUsUUFBUTs0Q0FDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBRSxDQUFDLEVBQUUsS0FBSyxDQUFFO3lDQUNsQyxFQUFFOzRDQUNDLElBQUksRUFBRSxNQUFNOzRDQUNaLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFFO3lDQUM5QyxFQUFFOzRDQUNDLElBQUksRUFBRSxRQUFROzRDQUNkLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFFLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFFO3lDQUMvQyxDQUFDLENBQUE7aUNBQ0w7NEJBQ0wsQ0FBQyxDQUFDLElBQ0w7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBQ0gsT0FBTyxJQUFJLENBQUM7Z0JBQ2hCLENBQUM7YUFDSixDQUFDLENBQUM7UUFDUCxDQUFDO1FBR0QsT0FBTyxZQUFDLEVBQVU7Z0JBQVIsa0JBQU07WUFDWixJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDaEIsSUFBQSxvQkFBSyxDQUFZO1lBRXpCLEtBQUssQ0FBQyxPQUFPLENBQUM7Z0JBQ1YsS0FBSyxPQUFBO2FBQ1IsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBRSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hELENBQUM7UUFHRCxZQUFZLFlBQUUsTUFBTTtZQUFwQixpQkFlQztZQWRHLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNsQixJQUFBLGVBQTJCLEVBQXpCLFlBQUcsRUFBRSxnQkFBb0IsQ0FBQztZQUVsQyxJQUFLLENBQUMsR0FBRyxJQUFHLENBQUMsTUFBTSxFQUFHO2dCQUFFLE9BQU87YUFBRTtZQUVqQyxJQUFLLEtBQUssRUFBRztnQkFDVCxZQUFZLENBQUUsS0FBSyxDQUFFLENBQUM7YUFDekI7WUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDO2dCQUNWLEtBQUssRUFBRSxVQUFVLENBQUM7b0JBQ2QsS0FBSSxDQUFDLFFBQVEsQ0FBRSxNQUFNLENBQUUsQ0FBQTtnQkFDM0IsQ0FBQyxFQUFFLEdBQUcsQ0FBRTthQUNYLENBQUMsQ0FBQztRQUNQLENBQUM7UUFHRCxRQUFRLFlBQUUsTUFBTTtZQUNaLElBQU0sS0FBSyxHQUFRLElBQUksQ0FBQztZQUNsQixJQUFBLGVBQWdDLEVBQTlCLFlBQUcsRUFBRSxnQkFBSyxFQUFFLFlBQWtCLENBQUM7WUFFdkMsY0FBSSxDQUFDO2dCQUNELE1BQU0sRUFBRSxNQUFNO2dCQUNkLFVBQVUsRUFBRSxNQUFNO2dCQUNsQixJQUFJLEVBQUUsaUNBQThCLEtBQUssSUFBSSxTQUFTLFVBQUksTUFBUTthQUNyRSxDQUFDLENBQUMsSUFBSSxDQUFFLFVBQUEsR0FBRztnQkFDQSxJQUFBLG1CQUFNLEVBQUUsZUFBSSxDQUFTO2dCQUU3QixJQUFLLE1BQU0sS0FBSyxHQUFHLEVBQUc7b0JBQ2xCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQzt3QkFDakIsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsVUFBVSxFQUFFLEVBQUc7cUJBQ2xCLENBQUMsQ0FBQztpQkFDTjtnQkFFRCxLQUFLLENBQUMsT0FBTyxDQUFDO29CQUNWLE1BQU0sRUFBRSxJQUFJO29CQUNaLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFFLElBQUksQ0FBRSxDQUFDLENBQUM7d0JBQy9CLElBQUksQ0FBQyxLQUFLLENBQUUsQ0FBQyxFQUFFLEdBQUcsQ0FBRSxDQUFDLENBQUM7d0JBQ3RCLEVBQUc7aUJBQ1YsQ0FBQyxDQUFDO1lBRVAsQ0FBQyxDQUFDLENBQUE7UUFDTixDQUFDO1FBR0QsU0FBUyxZQUFFLE1BQU07WUFDYixJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDeEIsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDVixNQUFNLFFBQUE7YUFDVCxDQUFDLENBQUM7UUFDUCxDQUFDO1FBR0QsTUFBTTtZQUFOLGlCQUlDO1lBSEcsVUFBVSxDQUFDO2dCQUNQLEtBQUksQ0FBQyxTQUFTLENBQUUsS0FBSyxDQUFFLENBQUM7WUFDNUIsQ0FBQyxFQUFFLEdBQUcsQ0FBRSxDQUFDO1FBQ2IsQ0FBQztRQUdELE9BQU87WUFDSCxJQUFJLENBQUMsU0FBUyxDQUFFLElBQUksQ0FBRSxDQUFDO1FBQzNCLENBQUM7UUFHRCxRQUFRLFlBQUMsRUFBaUI7Z0JBQWYsZ0NBQWE7WUFDcEIsSUFBTSxLQUFLLEdBQVEsSUFBSSxDQUFDO1lBQ3hCLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLE1BQU0sQ0FBQztZQUNyQyxJQUFBLGlDQUFJLENBQTJCO1lBRXZDLElBQUssQ0FBQyxPQUFPLEVBQUc7Z0JBQUUsT0FBTzthQUFFO1lBQzNCLElBQUssSUFBSSxDQUFFLE9BQU8sQ0FBRSxLQUFLLFNBQVMsRUFBRztnQkFBRSxPQUFPO2FBQUU7WUFFaEQsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDVixLQUFLLEVBQUUsSUFBSSxDQUFFLE9BQU8sQ0FBRTthQUN6QixDQUFDLENBQUM7WUFFSCxLQUFLLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUUsQ0FBQztRQUN6QyxDQUFDO1FBR0QsT0FBTyxZQUFFLENBQUM7WUFDTixJQUFNLEtBQUssR0FBUSxJQUFJLENBQUM7WUFDeEIsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDVixLQUFLLEVBQUUsQ0FBQzthQUNYLENBQUMsQ0FBQztRQUNQLENBQUM7S0FFSjtJQUVELFFBQVEsRUFBRTtRQUNOLElBQUksQ0FBQyxXQUFXLEVBQUcsQ0FBQztJQUN4QixDQUFDO0NBQ0osQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2VG8gfSBmcm9tICcuLi8uLi91dGlscy9yb3V0ZS5qcyc7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSAnLi4vLi4vdXRpbHMvaHR0cC5qcyc7XG5pbXBvcnQgeyBjb21wdXRlZCB9IGZyb20gJy4uLy4uL2xpYi92dWVmeS9pbmRleC5qcyc7XG5cbi8qKlxuICogQGRlc2NyaXB0aW9uXG4gKiDoh6rliqjlrozmiJAgLSDluKblh7rlj6/pgInpoblcbiAqL1xuQ29tcG9uZW50KHtcblxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOWxnuaAp+WIl+ihqFxuICAgICAqL1xuICAgIHByb3BlcnRpZXM6IHtcblxuICAgICAgICAvKiog6K+35rGC5Zyw5Z2AICovXG4gICAgICAgIHVybDoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOivt+axguWPguaVsCAqL1xuICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICdrZXl3b3JkJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDmnIDlpKflsZXnpLrlj6/pgInpobkgKi9cbiAgICAgICAgbWF4OiB7XG4gICAgICAgICAgICB0eXBlOiBOdW1iZXIsXG4gICAgICAgICAgICB2YWx1ZTogNVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDopoHlsZXnpLrnmoTlrZfmrrXvvIzpgJflj7fpmpTlvIAgKi9cbiAgICAgICAgc2hvd0tleToge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICduYW1lJ1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDngrnlh7vpgInpobnml7bvvIznlKjlk6rkuKrlgLzloavlhYXliLBpbnB1dCAqL1xuICAgICAgICBmaWxsS2V5OiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJ25hbWUnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOihqOWNlSAtIOaYr+WQpuWPr+eUqCAqL1xuICAgICAgICBkaXNhYmxlZDoge1xuICAgICAgICAgICAgdHlwZTogQm9vbGVhbixcbiAgICAgICAgICAgIHZhbHVlOiBmYWxzZVxuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDooajljZUgLSDlgLwgKi9cbiAgICAgICAgZGVmYXVsdFZhbHVlOiB7XG4gICAgICAgICAgICB0eXBlOiBTdHJpbmcsXG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICBvYnNlcnZlcjogJ2luaXRWYWwnXG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOihqOWNlSAtIOm7mOiupCAqL1xuICAgICAgICBwbGFjZWhvbGRlcjoge1xuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgICAgICAgdmFsdWU6ICcnXG4gICAgICAgIH1cbiAgICB9LFxuICBcbiAgICAvKipcbiAgICAgKiDnu4Tku7bnmoTliJ3lp4vmlbDmja5cbiAgICAgKi9cbiAgICBkYXRhOiB7XG5cbiAgICAgICAgLyoqIOi+k+WFpSAqL1xuICAgICAgICB2YWx1ZTogJycsXG5cbiAgICAgICAgLyoqIOWxleekuuWIl+ihqCAqL1xuICAgICAgICBpc1Nob3c6IGZhbHNlLFxuXG4gICAgICAgIC8qKiDlrprml7blmaggKi9cbiAgICAgICAgdGltZXI6IG51bGwsXG5cbiAgICAgICAgLyoqIOe7k+aenOWIl+ihqCAqL1xuICAgICAgICByZXN1bHRMaXN0OiBbIF1cblxuICAgIH0sXG4gIFxuICAgIC8qKlxuICAgICAqIOe7hOS7tueahOaWueazleWIl+ihqFxuICAgICAqL1xuICAgIG1ldGhvZHM6IHtcblxuICAgICAgICBydW5Db21wdXRlZCggKSB7XG4gICAgICAgICAgICBjb21wdXRlZCggdGhpcywge1xuXG4gICAgICAgICAgICAgICAgLyoqIOe7k+aenOWIl+ihqCAqL1xuICAgICAgICAgICAgICAgIHJlc3VsdExpc3QkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcmVzdWx0TGlzdCwgdmFsdWUgfSA9IHRoaXMuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvd0tleSA9IHRoaXMuZGF0YS5zaG93S2V5IHx8ICduYW1lJztcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hvd0tleUFyciA9IHNob3dLZXkuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmFsdWUkID0gdmFsdWUgP1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucmVwbGFjZSgvIC9nLCAnJykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgJyc7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWV0YSA9IHJlc3VsdExpc3QubWFwKCBpdGVtID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4uaXRlbSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93S2V5QXJyJDogc2hvd0tleUFyci5tYXAoIGtleSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGFsbFRleHQgPSBpdGVtWyBrZXkgXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCAhYWxsVGV4dCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdub3JtYWwnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBhbGxUZXh0LmluZGV4T2YoIHZhbHVlJCApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ25vcm1hbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYWxsVGV4dC5zbGljZSggMCwgaW5kZXggKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBhbGxUZXh0LnNsaWNlKCBpbmRleCwgdmFsdWUkLmxlbmd0aCApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ25vcm1hbCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYWxsVGV4dC5zbGljZSggaW5kZXggKyB2YWx1ZSQubGVuZ3RoIClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOi+k+WFpSAqL1xuICAgICAgICBvbklucHV0KHsgZGV0YWlsIH0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyB2YWx1ZSB9ID0gZGV0YWlsO1xuXG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzXy50cmlnZ2VyRXZlbnQoJ2lucHV0JywgdmFsdWUgKTtcbiAgICAgICAgICAgIHRoaXMuYmVmb3JlU2VhcmNoKCB2YWx1ZS5yZXBsYWNlKC8gL2csICcnKSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyoqIOmYsuaKliAtIOWPkemAgeivt+axgiAqL1xuICAgICAgICBiZWZvcmVTZWFyY2goIHNlYXJjaCApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyB1cmwsIHRpbWVyIH0gPSB0aGlzXy5kYXRhO1xuXG4gICAgICAgICAgICBpZiAoICF1cmwgfHwhc2VhcmNoICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgaWYgKCB0aW1lciApIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoIHRpbWVyICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHRpbWVyOiBzZXRUaW1lb3V0KCggKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25TZWFyY2goIHNlYXJjaCApXG4gICAgICAgICAgICAgICAgfSwgNTAwIClcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDlj5HpgIHor7fmsYIgKi9cbiAgICAgICAgb25TZWFyY2goIHNlYXJjaCApIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgeyB1cmwsIHF1ZXJ5LCBtYXggfSA9IHRoaXNfLmRhdGE7XG4gICAgXG4gICAgICAgICAgICBodHRwKHtcbiAgICAgICAgICAgICAgICBlcnJNc2c6ICdub25lJyxcbiAgICAgICAgICAgICAgICBsb2FkaW5nTXNnOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgcGF0aDogYC9hcGlzL2NvbW1vbi9jb21wYW55LWNoZWNrPyR7cXVlcnkgfHwgJ2tleXdvcmQnfT0ke3NlYXJjaH1gXG4gICAgICAgICAgICB9KS50aGVuKCByZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgc3RhdHVzLCBkYXRhIH0gPSByZXM7XG4gICAgXG4gICAgICAgICAgICAgICAgaWYgKCBzdGF0dXMgIT09IDIwMCApIHsgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzU2hvdzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRMaXN0OiBbIF1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgICAgIGlzU2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0TGlzdDogQXJyYXkuaXNBcnJheSggZGF0YSApID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuc2xpY2UoIDAsIG1heCApIDogXG4gICAgICAgICAgICAgICAgICAgICAgICBbIF1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog5bGV56S6ICovXG4gICAgICAgIG9uU2V0U2hvdyggaXNTaG93ICkge1xuICAgICAgICAgICAgY29uc3QgdGhpc186IGFueSA9IHRoaXM7XG4gICAgICAgICAgICB0aGlzXy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgICBpc1Nob3dcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDlpLHnhKYgKi9cbiAgICAgICAgb25CbHVyKCApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCApID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2V0U2hvdyggZmFsc2UgKTtcbiAgICAgICAgICAgIH0sIDEwMCApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDogZrnhKYgKi9cbiAgICAgICAgb25Gb2N1cyggKSB7XG4gICAgICAgICAgICB0aGlzLm9uU2V0U2hvdyggdHJ1ZSApO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8qKiDpgInmi6kgKi9cbiAgICAgICAgb25DaG9pY2UoeyBjdXJyZW50VGFyZ2V0IH0pIHtcbiAgICAgICAgICAgIGNvbnN0IHRoaXNfOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgY29uc3QgZmlsbEtleSA9IHRoaXNfLmRhdGEuZmlsbEtleSB8fCAnbmFtZSc7XG4gICAgICAgICAgICBjb25zdCB7IGl0ZW0gfSA9IGN1cnJlbnRUYXJnZXQuZGF0YXNldDtcblxuICAgICAgICAgICAgaWYgKCAhZmlsbEtleSApIHsgcmV0dXJuOyB9XG4gICAgICAgICAgICBpZiAoIGl0ZW1bIGZpbGxLZXkgXSA9PT0gdW5kZWZpbmVkICkgeyByZXR1cm47IH1cblxuICAgICAgICAgICAgdGhpc18uc2V0RGF0YSh7XG4gICAgICAgICAgICAgICAgdmFsdWU6IGl0ZW1bIGZpbGxLZXkgXVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXNfLnRyaWdnZXJFdmVudCgnY29uZmlybScsIGl0ZW0gKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiog6LWL5YC8ICovXG4gICAgICAgIGluaXRWYWwoIHYgKSB7XG4gICAgICAgICAgICBjb25zdCB0aGlzXzogYW55ID0gdGhpcztcbiAgICAgICAgICAgIHRoaXNfLnNldERhdGEoe1xuICAgICAgICAgICAgICAgIHZhbHVlOiB2XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfSxcblxuICAgIGF0dGFjaGVkOiBmdW5jdGlvbiggKSB7XG4gICAgICAgIHRoaXMucnVuQ29tcHV0ZWQoICk7XG4gICAgfVxufSlcbiAgIl19