import { http } from './http';
export function formatTime(date: Date): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    // return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
    return [year, month, day].map(formatNumber).join('/') 
}

// 防抖
export function debounce(func , wait){
    let timeout ;
    return function(this: any) {
        let args = arguments;
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply((this as any), args);
        },wait);
    }
}

export function serialize(s: string){
    const arr = s.split('&').map(v => {
        return v.split('=');
    });
    const obj = {};
    arr.map((v , i) => {
        obj[arr[i][0]] = arr[i][1] || ''
    })
    return obj;
}

const formatNumber = (n: number) => {
    const str = n.toString()
    return str[1] ? str : '0' + str
}

export const getUuid = async () => {
    
    return  http({
        method: 'get',
        path: `/uuid` 
    })
}

/** 后台的优惠券数据格式 转换为 前端组件 */
export const couponToFront = ( item, values = { }) => {
    const { id, name, type, typeName, isEnabled, isDefault, isExpired,
        endMills, startMills, remark, templateName } = item;
    const calculateRule = item.calculateRule || { };

    const calculateType = calculateRule.type || item.calculateType;
    const couponTypeName = calculateRule.typeName || item.couponTypeName;
    const fullReduceNum = calculateRule.fullReduceNum || item.fullReduceNum;
    const rebateNum = calculateRule.rebateNum || item.rebateNum;
    const reduceNum = calculateRule.reduceNum || item.reduceNum;
    const fullReduceMinPrice = calculateRule.fullReduceMinPrice || item.fullReduceMinPrice;

    const fullRebate = calculateRule.fullRebate || item.fullRebate;
    const fullRebateText = Number(( Number( fullRebate ) / 10 ).toFixed( 1 ));
    
    /**
     * calculateType
     * 0 满减
     * 1 满打折
     * 2 打折
     * 3 现金优惠
     */

    return {
        meta: { ...item },
        id,
        type,
        isDefault: isDefault === '1',
        used: isEnabled === '0',
        discountType: '',
        typeLabel: couponTypeName,
        title: name,
        start: startMills || 0,
        end: endMills || 0,
        useTips: remark,
        passed: isExpired === '1',
        symbol: calculateType === '0' || calculateType === '3' ? '¥' : '',
        value: calculateType === '0' ? 
            fullReduceNum : 
            calculateType === '1' ?
                `${fullRebateText}折` :
                calculateType === '2' ?
                    `${rebateNum}折` :
                    calculateType === '3' ?
                        reduceNum :
                        0,
        tips: calculateType === '0' ? 
            `满${fullReduceMinPrice}元,减${fullReduceNum}元` : 
            calculateType === '1' ?
                `满${fullReduceMinPrice}` :
                calculateType === '2' ?
                `${rebateNum}折` :
                    calculateType === '3' ?
                    `减${reduceNum}元` :
                    ``,
        smallTips: calculateType === '0' ? 
                    `满${fullReduceMinPrice}元,减${fullReduceNum}元` : 
                    calculateType === '1' ?
                        `满${fullReduceMinPrice} ${fullRebateText}折` :
                        calculateType === '2' ?
                        `${rebateNum}折` :
                            calculateType === '3' ?
                            `减${reduceNum}元` :
                            ``,
        ...values
    }
}

/** 后台的地址数据格式 转换为 前端组件 */
export const addressToFront = item => {
    const { id, isDefault, receiverAddress, receiverProvinceName, receiverProvinceCode, receiverName, 
        receiverTelephone, receiverCityName, receiverCityCode, receiverCountyCode, receiverCountyName } = item;
    return {
        id,
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
    }
};

/** 地址组件数据格式 转换为 后台字段 */
export const addressToBack = meta => {
    let result = { ...meta };
    const area = [ ...meta.area ];
    const provice = area[ 0 ];
    const city = area[ 1 ];
    const county = area[ 2 ];

    if ( !!provice ) {
        result = {
            ...result,
            receiverProvinceCode: provice.value,
            receiverProvinceName: provice.label
        };
    }

    if ( !!city ) {
        result = {
            ...result,
            receiverCityCode: city.value,
            receiverCityName: city.label
        };
    }

    if ( !!county ) {
        result = {
            ...result,
            receiverCountyCode: county.value,
            receiverCountyName: county.label
        };
    } 

    result = {
        ...result,
        isDefault: result.isDefault ? '1' : '0'
    }

    return result;
}

/** 地址组件change数据格式 转换为 后台字段 */
export const addressChangeDataToBack = meta => {
    let result: any = !!meta.id ? { id: meta.id } : { };

    result = {
        ...result,
        receiverProvinceCode: meta.provinceCode,
        receiverProvinceName: meta.provinceName
    };

    result = {
        ...result,
        receiverCityCode: meta.cityCode,
        receiverCityName: meta.cityName
    };

    result = {
        ...result,
        receiverCountyCode: meta.areaCode,
        receiverCountyName: meta.areaName
    }; 

    result = {
        ...result,
        receiverName: meta.name,
        receiverAddress: meta.address,
        receiverTelephone: meta.phone,
        isDefault: meta.default ? '1' : '0'
    }

    return result;
}

/** 把query转为对象 */
export const queryParse = ( s = '' ) => {
    let result: any = { };
    const queryArr = s.split('&');
    queryArr.map( queryItem => {
        const [ k, v ] = queryItem.split('=');
        result = {
            ...result,
            [ k ]: v 
        };
    });
    return result;
}