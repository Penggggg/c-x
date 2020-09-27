
const isProd = ( process.env.NODE_ENV || '').toLowerCase( ).includes('prod');

/** 算法封面 */
export const algorithmCovers = [
    '/dist/img/bg-图像分类.jpg',
    '/dist/img/bg-物体检测.jpg',
    '/dist/img/bg-图片分割.jpg'
];

/** 系统地址 */
export const systems = {
    /** 数据集地址 */
    Datasets: isProd ? 
        `http://drive.research.cvte.cn/` :
        `http://10.22.21.26:9081/#/dashboard`,
    /** 服务管理 */
    Sys: isProd ? 
        `http://server.research.cvte.cn` :
        `http://10.22.21.27:8090`
}

/** 通过算法名称，匹配封面 */
export const findAlgorithmCover = name => {
    const algorithmName = decodeURIComponent( name );
    return algorithmCovers.find( x => !!getMaxStr( x, algorithmName )) || '/dist/img/ai-0.jpg'
}

/** 用javascript求两个字符串最大的相同的子串 */
function getMaxStr( str1,str2 ) {
    var max = str1.length > str2.length ? str1 : str2;
    var min = (max == str1 ? str2 : str1);
    for(var i = 0; i < min.length; i++){
        for(var x = 0, y = min.length - i;y != min.length + 1;x++,y++){
        //y表示所取字符串的长度
            var newStr = min.substring(x,y);
            //判断max中是否包含newStr
            if(max.indexOf(newStr) != -1){
                return newStr;
            }
        }
    }
    return '';
}