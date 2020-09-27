import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';
import { InvoiceChoiceType, InvoiceType } from '../../utils/constant';

const app = getApp< IApp >( );

/**
 * @description
 * 订单 - 发票填写
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        placeholder: {
            type: String,
            value: '发票开票'
        },

        /** 默认的收货地址 */
        defaultAddress: {
            type: String,
            value: ''
        }

    },
  
    /**
     * 组件的初始数据
     */
    data: {

        /** 选中 */
        selecting: null,

        /** 枚举 - 发票类型 */
        dicType: [
            {
                label: '企业',
                value: InvoiceChoiceType.company
            }, {
                label: '个人',
                value: InvoiceChoiceType.personal
            }, {
                label: '无需',
                value: InvoiceChoiceType.noneed
            }
        ],

        /** 枚举 - 专票/普票 */
        dicInvoiceType: [
            {
                label: '普票',
                value: InvoiceType.normal
            }, {
                label: '专票',
                value: InvoiceType.specail
            }
        ],

    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        /** 监听 */
        watchApp( ) {
            app.watch$('Form.orderInvoice', v => {
                !!v && Object.keys( v ).length > 0 && this.onConfirm( v );
            });
        },

        /** 跳到订单创建页面 */
        goEdit( ) {
            const this_: any = this;
            const { selecting, defaultAddress } = this_.data;
            navTo(`/pages/invoice-create/index?editing=${ !!selecting ? 1 : 0 }&defaultAddress=${defaultAddress}`);
        },

        /** 表单填写完成 */
        onConfirm( v ) {
            const this_: any = this;
            const { dicType, dicInvoiceType } = this_.data;

            const typeTarget$ = dicType.find( x => x.value === v.type );
            const invoiceTypeTarget$ = dicInvoiceType.find( x => x.value === v.invoiceType );

            const meta = {
                ...v,
                type$: typeTarget$ ? typeTarget$.label : '',
                invoiceType$: invoiceTypeTarget$ ? invoiceTypeTarget$.label : '',
            };

            this_.setData({
                selecting: meta
            });
            this_.triggerEvent('change', v );
        }

    },

    attached: function( ) {
        this.watchApp( );
    }
})
  