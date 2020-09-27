/** 时间戳转换日期格式 */
export var timestampToTime = function (timestamp) {
    var date = new Date(timestamp); //timestamp*1000 时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M = (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = date.getDate() < 10 ? "0" + date.getDate() + " " : date.getDate() + " ";
    var h = "" + (String(date.getHours()).length === 1 ? '0' + date.getHours() : date.getHours()) + ":";
    // var m = date.getMinutes() + ":";
    var m = "" + (String(date.getMinutes()).length === 1 ? '0' + date.getMinutes() : date.getMinutes()) + ":";
    // var s = date.getSeconds();
    var s = "" + (String(date.getSeconds()).length === 1 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
};
/** 测试 */
export var test = function () {
    console.log('just a test !');
};
//# sourceMappingURL=function.js.map