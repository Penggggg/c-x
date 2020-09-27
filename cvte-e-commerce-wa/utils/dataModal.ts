interface modalItem {
    key: string,   //  当前页面需要的字段
    defaultValue: any,  // 默认值
    source: string, // 来源于哪个字段
    type: 'String' | 'Number' | 'Date' | 'Array',
    format?: string,
    dic?: {      // 是否需要字典转换
        data: object[],
        format: {
            key: string,
            value: string
        }
    }
}

interface newModalItem{
    key: string,
    type: 'String' | 'Number' | 'Date' | 'Array' | 'Object',
    default?: any,
    format?: Array<'dic' | 'date-YY-MM-DD HH:mm:ss' | 'fixed-2' | 'sum-3'>,
    children?: newModalItem[]
}

class NewModal {
    private dataList: newModalItem;
    private transfer = {};
    constructor(data: newModalItem) {
        this.dataList = data;
    }

    private format() {
    }

    private buildObj(data: newModalItem, origin){
        if(data.type === 'String'){
            // 函数操作...
            origin[data.key] = data.default || ''
            return origin[data.key] ;
            // return data.default || '';
        }else if(data.type === 'Number'){
            // 函数操作...
            origin[data.key] = data.default || 0;
            return origin[data.key] ;
            // return data.default || 0;
        }else if(data.type === 'Date'){
            // 函数操作...
            origin[data.key] = data.default || new Date().getTime();
            return origin[data.key] ;
            // return data.default || new Date().getTime();
        }else if(data.type === 'Array'){
            // 函数操作...
            if(data.children){
                // this.buildObj(data.children , origin[data.key]);
                // origin[data.key] = data.children[0].
                // origin[data.key][0] = this.buildObj(data.children[0] , {});
                origin[data.key] = [this.buildObj(data.children[0], {})];
                return origin[data.key] ;
            }
            origin[data.key] = data.default || new Array();
            return origin[data.key] ;
            // 递归操作
            // data.children && data.children.map(item => {
            //     this.buildObj(item , origin[data.key]);
            // }) 
        }else if(data.type === 'Object'){
            // 函数操作...


            if(data.children){
                origin[data.key] = {};
                data.children.map(item => {
                    // const temp = {};
                    origin[data.key][item.key] = this.buildObj(item, {});
                    // return temp;
                }) 
                return origin ;
            }
            origin[data.key] = data.default || {};
            return data.default || {};
        }
    }

    getDefault(){
        const temp = Object.create(null);
        this.buildObj(this.dataList,temp);
        return temp;
    }

    parse(data) {
        
    }
}
class Modal {
    private dataList: Array<modalItem>;
    private transfer = {};
    constructor(data: Array<modalItem>) {
        this.dataList = data;
    }

    private format() {

    }

    parse(data) {
        this.dataList.map(item => {
            this.transfer[item.key];
        })
    }
}

// new Modal([]);

var datas = [{
    actId: "",
    attribute1: null,
    attribute2: null,
    attribute3: null,
    attribute4: null,
    attribute5: null,
    attribute6: null,
    backgroundColor: "#red",
    batchNo: null,
    calculateRule: null,
    crtHost: "127.0.0.1",
    crtName: "许宪成",
    crtTime: "2019-09-02T08:40:20.000+0000",
    crtUser: "67e340a29247432084121dd96a1d7228",
    effectiveTime: "2019-09-01T16:00:00.000+0000",
    enableEdit: "0",
    expirationInterval: null,
    expiredTime: null,
    icon: "www.google.com",
    id: "26eb44ae79a7454ba75cb4627d5b6c16",
    image: "www.google.com",
    isDeleted: "0",
    isEnabled: "1",
    leftQuantity: null,
    limitReceiveNum: 1,
    limitRules: [],
    name: "P65CA套装优惠券",
    remark: "P65CA套装优惠券",
    status: "1",
    subName: "P65CA套装优惠券",
    subStatus: null,
    tenantId: "8aa95a75877542d398881a30594beadf",
    totalQuantity: 100,
    type: null,
    orders: {}
}]


export default NewModal;


// function test() {
//     interface modalItem {
//         key: string,   //  当前页面需要的字段
//         defaultValue: any,  // 默认值
//         source: string, // 来源于哪个字段
//         type: 'String' | 'Number' | 'Date' | 'Array',
//         format?: string,
//         dic?: {      // 是否需要字典转换
//             data: object[],
//             format: {
//                 key: string,
//                 value: string
//             }
//         }
//     }

//     return class Modal {
//         private dataList: Array<modalItem>;
//         private transfer = {};
//         constructor(data: Array<modalItem>) {
//             this.dataList = data;
//         }

//         private format() {

//         }

//         parse(data) {
//             this.dataList.map(item => {
//                 this.transfer[item.key];
//             })
//         }
//     }
// }