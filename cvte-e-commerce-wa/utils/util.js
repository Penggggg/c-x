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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    return [year, month, day].map(formatNumber).join('/');
}
exports.formatTime = formatTime;
function debounce(func, wait) {
    var timeout;
    return function () {
        var _this = this;
        var args = arguments;
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(function () {
            func.apply(_this, args);
        }, wait);
    };
}
exports.debounce = debounce;
function serialize(s) {
    var arr = s.split('&').map(function (v) {
        return v.split('=');
    });
    var obj = {};
    arr.map(function (v, i) {
        obj[arr[i][0]] = arr[i][1] || '';
    });
    return obj;
}
exports.serialize = serialize;
var formatNumber = function (n) {
    var str = n.toString();
    return str[1] ? str : '0' + str;
};
exports.getUuid = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, http_1.http({
                method: 'get',
                path: "/uuid"
            })];
    });
}); };
exports.couponToFront = function (item, values) {
    if (values === void 0) { values = {}; }
    var id = item.id, name = item.name, type = item.type, typeName = item.typeName, isEnabled = item.isEnabled, isDefault = item.isDefault, isExpired = item.isExpired, endMills = item.endMills, startMills = item.startMills, remark = item.remark, templateName = item.templateName;
    var calculateRule = item.calculateRule || {};
    var calculateType = calculateRule.type || item.calculateType;
    var couponTypeName = calculateRule.typeName || item.couponTypeName;
    var fullReduceNum = calculateRule.fullReduceNum || item.fullReduceNum;
    var rebateNum = calculateRule.rebateNum || item.rebateNum;
    var reduceNum = calculateRule.reduceNum || item.reduceNum;
    var fullReduceMinPrice = calculateRule.fullReduceMinPrice || item.fullReduceMinPrice;
    var fullRebate = calculateRule.fullRebate || item.fullRebate;
    var fullRebateText = Number((Number(fullRebate) / 10).toFixed(1));
    return __assign({ meta: __assign({}, item), id: id,
        type: type, isDefault: isDefault === '1', used: isEnabled === '0', discountType: '', typeLabel: couponTypeName, title: name, start: startMills || 0, end: endMills || 0, useTips: remark, passed: isExpired === '1', symbol: calculateType === '0' || calculateType === '3' ? '¥' : '', value: calculateType === '0' ?
            fullReduceNum :
            calculateType === '1' ?
                fullRebateText + "\u6298" :
                calculateType === '2' ?
                    rebateNum + "\u6298" :
                    calculateType === '3' ?
                        reduceNum :
                        0, tips: calculateType === '0' ?
            "\u6EE1" + fullReduceMinPrice + "\u5143,\u51CF" + fullReduceNum + "\u5143" :
            calculateType === '1' ?
                "\u6EE1" + fullReduceMinPrice :
                calculateType === '2' ?
                    rebateNum + "\u6298" :
                    calculateType === '3' ?
                        "\u51CF" + reduceNum + "\u5143" :
                        "", smallTips: calculateType === '0' ?
            "\u6EE1" + fullReduceMinPrice + "\u5143,\u51CF" + fullReduceNum + "\u5143" :
            calculateType === '1' ?
                "\u6EE1" + fullReduceMinPrice + " " + fullRebateText + "\u6298" :
                calculateType === '2' ?
                    rebateNum + "\u6298" :
                    calculateType === '3' ?
                        "\u51CF" + reduceNum + "\u5143" :
                        "" }, values);
};
exports.addressToFront = function (item) {
    var id = item.id, isDefault = item.isDefault, receiverAddress = item.receiverAddress, receiverProvinceName = item.receiverProvinceName, receiverProvinceCode = item.receiverProvinceCode, receiverName = item.receiverName, receiverTelephone = item.receiverTelephone, receiverCityName = item.receiverCityName, receiverCityCode = item.receiverCityCode, receiverCountyCode = item.receiverCountyCode, receiverCountyName = item.receiverCountyName;
    return {
        id: id,
        address: receiverAddress,
        areaCode: receiverCountyCode,
        areaName: receiverCountyName,
        cityCode: receiverCityCode,
        cityName: receiverCityName,
        default: isDefault === '1',
        name: receiverName,
        phone: receiverTelephone,
        provinceCode: receiverProvinceCode,
        provinceName: receiverProvinceName
    };
};
exports.addressToBack = function (meta) {
    var result = __assign({}, meta);
    var area = meta.area.slice();
    var provice = area[0];
    var city = area[1];
    var county = area[2];
    if (!!provice) {
        result = __assign({}, result, { receiverProvinceCode: provice.value, receiverProvinceName: provice.label });
    }
    if (!!city) {
        result = __assign({}, result, { receiverCityCode: city.value, receiverCityName: city.label });
    }
    if (!!county) {
        result = __assign({}, result, { receiverCountyCode: county.value, receiverCountyName: county.label });
    }
    result = __assign({}, result, { isDefault: result.isDefault ? '1' : '0' });
    return result;
};
exports.addressChangeDataToBack = function (meta) {
    var result = !!meta.id ? { id: meta.id } : {};
    result = __assign({}, result, { receiverProvinceCode: meta.provinceCode, receiverProvinceName: meta.provinceName });
    result = __assign({}, result, { receiverCityCode: meta.cityCode, receiverCityName: meta.cityName });
    result = __assign({}, result, { receiverCountyCode: meta.areaCode, receiverCountyName: meta.areaName });
    result = __assign({}, result, { receiverName: meta.name, receiverAddress: meta.address, receiverTelephone: meta.phone, isDefault: meta.default ? '1' : '0' });
    return result;
};
exports.queryParse = function (s) {
    if (s === void 0) { s = ''; }
    var result = {};
    var queryArr = s.split('&');
    queryArr.map(function (queryItem) {
        var _a;
        var _b = queryItem.split('='), k = _b[0], v = _b[1];
        result = __assign({}, result, (_a = {}, _a[k] = v, _a));
    });
    return result;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxpQkE4TkM7O0FBOU5ELCtCQUE4QjtBQUM5QixTQUFnQixVQUFVLENBQUMsSUFBVTtJQUNqQyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUE7SUFDL0IsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUNqQyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDMUIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQzVCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNoQyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFHaEMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUN6RCxDQUFDO0FBVkQsZ0NBVUM7QUFHRCxTQUFnQixRQUFRLENBQUMsSUFBSSxFQUFHLElBQUk7SUFDaEMsSUFBSSxPQUFPLENBQUU7SUFDYixPQUFPO1FBQUEsaUJBTU47UUFMRyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUM7UUFDckIsSUFBRyxPQUFPO1lBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLE9BQU8sR0FBRyxVQUFVLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBRSxLQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDO0lBQ1osQ0FBQyxDQUFBO0FBQ0wsQ0FBQztBQVRELDRCQVNDO0FB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LElBQUksQ0FBQyxLQUFLLEVBQzdCLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FDdEMsQ0FBQTtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQTtBQUdZLFFBQUEsVUFBVSxHQUFHLFVBQUUsQ0FBTTtJQUFOLGtCQUFBLEVBQUEsTUFBTTtJQUM5QixJQUFJLE1BQU0sR0FBUSxFQUFHLENBQUM7SUFDdEIsSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixRQUFRLENBQUMsR0FBRyxDQUFFLFVBQUEsU0FBUzs7UUFDYixJQUFBLHlCQUErQixFQUE3QixTQUFDLEVBQUUsU0FBMEIsQ0FBQztRQUN0QyxNQUFNLGdCQUNDLE1BQU0sZUFDUCxDQUFDLElBQUksQ0FBQyxNQUNYLENBQUM7SUFDTixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGh0dHAgfSBmcm9tICcuL2h0dHAnO1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRpbWUoZGF0ZTogRGF0ZSk6IHN0cmluZyB7XG4gICAgY29uc3QgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKVxuICAgIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMVxuICAgIGNvbnN0IGRheSA9IGRhdGUuZ2V0RGF0ZSgpXG4gICAgY29uc3QgaG91ciA9IGRhdGUuZ2V0SG91cnMoKVxuICAgIGNvbnN0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpXG4gICAgY29uc3Qgc2Vjb25kID0gZGF0ZS5nZXRTZWNvbmRzKClcblxuICAgIC8vIHJldHVybiBbeWVhciwgbW9udGgsIGRheV0ubWFwKGZvcm1hdE51bWJlcikuam9pbignLycpICsgJyAnICsgW2hvdXIsIG1pbnV0ZSwgc2Vjb25kXS5tYXAoZm9ybWF0TnVtYmVyKS5qb2luKCc6JylcbiAgICByZXR1cm4gW3llYXIsIG1vbnRoLCBkYXldLm1hcChmb3JtYXROdW1iZXIpLmpvaW4oJy8nKSBcbn1cblxuLy8g6Ziy5oqWXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZnVuYyAsIHdhaXQpe1xuICAgIGxldCB0aW1lb3V0IDtcbiAgICByZXR1cm4gZnVuY3Rpb24odGhpczogYW55KSB7XG4gICAgICAgIGxldCBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICBpZih0aW1lb3V0KSBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGZ1bmMuYXBwbHkoKHRoaXMgYXMgYW55KSwgYXJncyk7XG4gICAgICAgIH0sd2FpdCk7XG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKHM6IHN0cmluZyl7XG4gICAgY29uc3QgYXJyID0gcy5zcGxpdCgnJicpLm1hcCh2ID0+IHtcbiAgICAgICAgcmV0dXJuIHYuc3BsaXQoJz0nKTtcbiAgICB9KTtcbiAgICBjb25zdCBvYmogPSB7fTtcbiAgICBhcnIubWFwKCh2ICwgaSkgPT4ge1xuICAgICAgICBvYmpbYXJyW2ldWzBdXSA9IGFycltpXVsxXSB8fCAnJ1xuICAgIH0pXG4gICAgcmV0dXJuIG9iajtcbn1cblxuY29uc3QgZm9ybWF0TnVtYmVyID0gKG46IG51bWJlcikgPT4ge1xuICAgIGNvbnN0IHN0ciA9IG4udG9TdHJpbmcoKVxuICAgIHJldHVybiBzdHJbMV0gPyBzdHIgOiAnMCcgKyBzdHJcbn1cblxuZXhwb3J0IGNvbnN0IGdldFV1aWQgPSBhc3luYyAoKSA9PiB7XG4gICAgXG4gICAgcmV0dXJuICBodHRwKHtcbiAgICAgICAgbWV0aG9kOiAnZ2V0JyxcbiAgICAgICAgcGF0aDogYC91dWlkYCBcbiAgICB9KVxufVxuXG4vKiog5ZCO5Y+w55qE5LyY5oOg5Yi45pWw5o2u5qC85byPIOi9rOaNouS4uiDliY3nq6/nu4Tku7YgKi9cbmV4cG9ydCBjb25zdCBjb3Vwb25Ub0Zyb250ID0gKCBpdGVtLCB2YWx1ZXMgPSB7IH0pID0+IHtcbiAgICBjb25zdCB7IGlkLCBuYW1lLCB0eXBlLCB0eXBlTmFtZSwgaXNFbmFibGVkLCBpc0RlZmF1bHQsIGlzRXhwaXJlZCxcbiAgICAgICAgZW5kTWlsbHMsIHN0YXJ0TWlsbHMsIHJlbWFyaywgdGVtcGxhdGVOYW1lIH0gPSBpdGVtO1xuICAgIGNvbnN0IGNhbGN1bGF0ZVJ1bGUgPSBpdGVtLmNhbGN1bGF0ZVJ1bGUgfHwgeyB9O1xuXG4gICAgY29uc3QgY2FsY3VsYXRlVHlwZSA9IGNhbGN1bGF0ZVJ1bGUudHlwZSB8fCBpdGVtLmNhbGN1bGF0ZVR5cGU7XG4gICAgY29uc3QgY291cG9uVHlwZU5hbWUgPSBjYWxjdWxhdGVSdWxlLnR5cGVOYW1lIHx8IGl0ZW0uY291cG9uVHlwZU5hbWU7XG4gICAgY29uc3QgZnVsbFJlZHVjZU51bSA9IGNhbGN1bGF0ZVJ1bGUuZnVsbFJlZHVjZU51bSB8fCBpdGVtLmZ1bGxSZWR1Y2VOdW07XG4gICAgY29uc3QgcmViYXRlTnVtID0gY2FsY3VsYXRlUnVsZS5yZWJhdGVOdW0gfHwgaXRlbS5yZWJhdGVOdW07XG4gICAgY29uc3QgcmVkdWNlTnVtID0gY2FsY3VsYXRlUnVsZS5yZWR1Y2VOdW0gfHwgaXRlbS5yZWR1Y2VOdW07XG4gICAgY29uc3QgZnVsbFJlZHVjZU1pblByaWNlID0gY2FsY3VsYXRlUnVsZS5mdWxsUmVkdWNlTWluUHJpY2UgfHwgaXRlbS5mdWxsUmVkdWNlTWluUHJpY2U7XG5cbiAgICBjb25zdCBmdWxsUmViYXRlID0gY2FsY3VsYXRlUnVsZS5mdWxsUmViYXRlIHx8IGl0ZW0uZnVsbFJlYmF0ZTtcbiAgICBjb25zdCBmdWxsUmViYXRlVGV4dCA9IE51bWJlcigoIE51bWJlciggZnVsbFJlYmF0ZSApIC8gMTAgKS50b0ZpeGVkKCAxICkpO1xuICAgIFxuICAgIC8qKlxuICAgICAqIGNhbGN1bGF0ZVR5cGVcbiAgICAgKiAwIOa7oeWHj1xuICAgICAqIDEg5ruh5omT5oqYXG4gICAgICogMiDmiZPmiphcbiAgICAgKiAzIOeOsOmHkeS8mOaDoFxuICAgICAqL1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgbWV0YTogeyAuLi5pdGVtIH0sXG4gICAgICAgIGlkLFxuICAgICAgICB0eXBlLFxuICAgICAgICBpc0RlZmF1bHQ6IGlzRGVmYXVsdCA9PT0gJzEnLFxuICAgICAgICB1c2VkOiBpc0VuYWJsZWQgPT09ICcwJyxcbiAgICAgICAgZGlzY291bnRUeXBlOiAnJyxcbiAgICAgICAgdHlwZUxhYmVsOiBjb3Vwb25UeXBlTmFtZSxcbiAgICAgICAgdGl0bGU6IG5hbWUsXG4gICAgICAgIHN0YXJ0OiBzdGFydE1pbGxzIHx8IDAsXG4gICAgICAgIGVuZDogZW5kTWlsbHMgfHwgMCxcbiAgICAgICAgdXNlVGlwczogcmVtYXJrLFxuICAgICAgICBwYXNzZWQ6IGlzRXhwaXJlZCA9PT0gJzEnLFxuICAgICAgICBzeW1ib2w6IGNhbGN1bGF0ZVR5cGUgPT09ICcwJyB8fCBjYWxjdWxhdGVUeXBlID09PSAnMycgPyAnwqUnIDogJycsXG4gICAgICAgIHZhbHVlOiBjYWxjdWxhdGVUeXBlID09PSAnMCcgPyBcbiAgICAgICAgICAgIGZ1bGxSZWR1Y2VOdW0gOiBcbiAgICAgICAgICAgIGNhbGN1bGF0ZVR5cGUgPT09ICcxJyA/XG4gICAgICAgICAgICAgICAgYCR7ZnVsbFJlYmF0ZVRleHR95oqYYCA6XG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlVHlwZSA9PT0gJzInID9cbiAgICAgICAgICAgICAgICAgICAgYCR7cmViYXRlTnVtfeaKmGAgOlxuICAgICAgICAgICAgICAgICAgICBjYWxjdWxhdGVUeXBlID09PSAnMycgP1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVkdWNlTnVtIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgIHRpcHM6IGNhbGN1bGF0ZVR5cGUgPT09ICcwJyA/IFxuICAgICAgICAgICAgYOa7oSR7ZnVsbFJlZHVjZU1pblByaWNlfeWFgyzlh48ke2Z1bGxSZWR1Y2VOdW195YWDYCA6IFxuICAgICAgICAgICAgY2FsY3VsYXRlVHlwZSA9PT0gJzEnID9cbiAgICAgICAgICAgICAgICBg5ruhJHtmdWxsUmVkdWNlTWluUHJpY2V9YCA6XG4gICAgICAgICAgICAgICAgY2FsY3VsYXRlVHlwZSA9PT0gJzInID9cbiAgICAgICAgICAgICAgICBgJHtyZWJhdGVOdW195oqYYCA6XG4gICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZVR5cGUgPT09ICczJyA/XG4gICAgICAgICAgICAgICAgICAgIGDlh48ke3JlZHVjZU51bX3lhYNgIDpcbiAgICAgICAgICAgICAgICAgICAgYGAsXG4gICAgICAgIHNtYWxsVGlwczogY2FsY3VsYXRlVHlwZSA9PT0gJzAnID8gXG4gICAgICAgICAgICAgICAgICAgIGDmu6Eke2Z1bGxSZWR1Y2VNaW5QcmljZX3lhYMs5YePJHtmdWxsUmVkdWNlTnVtfeWFg2AgOiBcbiAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlVHlwZSA9PT0gJzEnID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGDmu6Eke2Z1bGxSZWR1Y2VNaW5QcmljZX0gJHtmdWxsUmViYXRlVGV4dH3miphgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGN1bGF0ZVR5cGUgPT09ICcyJyA/XG4gICAgICAgICAgICAgICAgICAgICAgICBgJHtyZWJhdGVOdW195oqYYCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYXRlVHlwZSA9PT0gJzMnID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBg5YePJHtyZWR1Y2VOdW195YWDYCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYGAsXG4gICAgICAgIC4uLnZhbHVlc1xuICAgIH1cbn1cblxuLyoqIOWQjuWPsOeahOWcsOWdgOaVsOaNruagvOW8jyDovazmjaLkuLog5YmN56uv57uE5Lu2ICovXG5leHBvcnQgY29uc3QgYWRkcmVzc1RvRnJvbnQgPSBpdGVtID0+IHtcbiAgICBjb25zdCB7IGlkLCBpc0RlZmF1bHQsIHJlY2VpdmVyQWRkcmVzcywgcmVjZWl2ZXJQcm92aW5jZU5hbWUsIHJlY2VpdmVyUHJvdmluY2VDb2RlLCByZWNlaXZlck5hbWUsIFxuICAgICAgICByZWNlaXZlclRlbGVwaG9uZSwgcmVjZWl2ZXJDaXR5TmFtZSwgcmVjZWl2ZXJDaXR5Q29kZSwgcmVjZWl2ZXJDb3VudHlDb2RlLCByZWNlaXZlckNvdW50eU5hbWUgfSA9IGl0ZW07XG4gICAgcmV0dXJuIHtcbiAgICAgICAgaWQsXG4gICAgICAgIGFkZHJlc3M6IHJlY2VpdmVyQWRkcmVzcyxcbiAgICAgICAgYXJlYUNvZGU6IHJlY2VpdmVyQ291bnR5Q29kZSxcbiAgICAgICAgYXJlYU5hbWU6IHJlY2VpdmVyQ291bnR5TmFtZSxcbiAgICAgICAgY2l0eUNvZGU6IHJlY2VpdmVyQ2l0eUNvZGUsXG4gICAgICAgIGNpdHlOYW1lOiByZWNlaXZlckNpdHlOYW1lLFxuICAgICAgICBkZWZhdWx0OiBpc0RlZmF1bHQgPT09ICcxJyxcbiAgICAgICAgbmFtZTogcmVjZWl2ZXJOYW1lLFxuICAgICAgICBwaG9uZTogcmVjZWl2ZXJUZWxlcGhvbmUsXG4gICAgICAgIHByb3ZpbmNlQ29kZTogcmVjZWl2ZXJQcm92aW5jZUNvZGUsXG4gICAgICAgIHByb3ZpbmNlTmFtZTogcmVjZWl2ZXJQcm92aW5jZU5hbWVcbiAgICB9XG59O1xuXG4vKiog5Zyw5Z2A57uE5Lu25pWw5o2u5qC85byPIOi9rOaNouS4uiDlkI7lj7DlrZfmrrUgKi9cbmV4cG9ydCBjb25zdCBhZGRyZXNzVG9CYWNrID0gbWV0YSA9PiB7XG4gICAgbGV0IHJlc3VsdCA9IHsgLi4ubWV0YSB9O1xuICAgIGNvbnN0IGFyZWEgPSBbIC4uLm1ldGEuYXJlYSBdO1xuICAgIGNvbnN0IHByb3ZpY2UgPSBhcmVhWyAwIF07XG4gICAgY29uc3QgY2l0eSA9IGFyZWFbIDEgXTtcbiAgICBjb25zdCBjb3VudHkgPSBhcmVhWyAyIF07XG5cbiAgICBpZiAoICEhcHJvdmljZSApIHtcbiAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICAgICAgcmVjZWl2ZXJQcm92aW5jZUNvZGU6IHByb3ZpY2UudmFsdWUsXG4gICAgICAgICAgICByZWNlaXZlclByb3ZpbmNlTmFtZTogcHJvdmljZS5sYWJlbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmICggISFjaXR5ICkge1xuICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgICAgICByZWNlaXZlckNpdHlDb2RlOiBjaXR5LnZhbHVlLFxuICAgICAgICAgICAgcmVjZWl2ZXJDaXR5TmFtZTogY2l0eS5sYWJlbFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGlmICggISFjb3VudHkgKSB7XG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgIHJlY2VpdmVyQ291bnR5Q29kZTogY291bnR5LnZhbHVlLFxuICAgICAgICAgICAgcmVjZWl2ZXJDb3VudHlOYW1lOiBjb3VudHkubGFiZWxcbiAgICAgICAgfTtcbiAgICB9IFxuXG4gICAgcmVzdWx0ID0ge1xuICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgIGlzRGVmYXVsdDogcmVzdWx0LmlzRGVmYXVsdCA/ICcxJyA6ICcwJ1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKiDlnLDlnYDnu4Tku7ZjaGFuZ2XmlbDmja7moLzlvI8g6L2s5o2i5Li6IOWQjuWPsOWtl+autSAqL1xuZXhwb3J0IGNvbnN0IGFkZHJlc3NDaGFuZ2VEYXRhVG9CYWNrID0gbWV0YSA9PiB7XG4gICAgbGV0IHJlc3VsdDogYW55ID0gISFtZXRhLmlkID8geyBpZDogbWV0YS5pZCB9IDogeyB9O1xuXG4gICAgcmVzdWx0ID0ge1xuICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgIHJlY2VpdmVyUHJvdmluY2VDb2RlOiBtZXRhLnByb3ZpbmNlQ29kZSxcbiAgICAgICAgcmVjZWl2ZXJQcm92aW5jZU5hbWU6IG1ldGEucHJvdmluY2VOYW1lXG4gICAgfTtcblxuICAgIHJlc3VsdCA9IHtcbiAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICByZWNlaXZlckNpdHlDb2RlOiBtZXRhLmNpdHlDb2RlLFxuICAgICAgICByZWNlaXZlckNpdHlOYW1lOiBtZXRhLmNpdHlOYW1lXG4gICAgfTtcblxuICAgIHJlc3VsdCA9IHtcbiAgICAgICAgLi4ucmVzdWx0LFxuICAgICAgICByZWNlaXZlckNvdW50eUNvZGU6IG1ldGEuYXJlYUNvZGUsXG4gICAgICAgIHJlY2VpdmVyQ291bnR5TmFtZTogbWV0YS5hcmVhTmFtZVxuICAgIH07IFxuXG4gICAgcmVzdWx0ID0ge1xuICAgICAgICAuLi5yZXN1bHQsXG4gICAgICAgIHJlY2VpdmVyTmFtZTogbWV0YS5uYW1lLFxuICAgICAgICByZWNlaXZlckFkZHJlc3M6IG1ldGEuYWRkcmVzcyxcbiAgICAgICAgcmVjZWl2ZXJUZWxlcGhvbmU6IG1ldGEucGhvbmUsXG4gICAgICAgIGlzRGVmYXVsdDogbWV0YS5kZWZhdWx0ID8gJzEnIDogJzAnXG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIOaKinF1ZXJ56L2s5Li65a+56LGhICovXG5leHBvcnQgY29uc3QgcXVlcnlQYXJzZSA9ICggcyA9ICcnICkgPT4ge1xuICAgIGxldCByZXN1bHQ6IGFueSA9IHsgfTtcbiAgICBjb25zdCBxdWVyeUFyciA9IHMuc3BsaXQoJyYnKTtcbiAgICBxdWVyeUFyci5tYXAoIHF1ZXJ5SXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IFsgaywgdiBdID0gcXVlcnlJdGVtLnNwbGl0KCc9Jyk7XG4gICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgICAgIFsgayBdOiB2IFxuICAgICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG59Il19