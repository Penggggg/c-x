import config from '../../config/index';
import { IApp } from "../../global";
import { http } from '../../utils/http';
import { computed } from '../../lib/vuefy/index';
import { navTo } from '../../utils/route';
import { InvoiceChoiceType, InvoiceType } from '../../utils/constant';

const app = getApp< IApp >( );

Page({

    data: {

        isIPhoneX: false,

        /** 是否初始化了表单 */
        inited: false,

        // 发票类型
        type: InvoiceChoiceType.company,

        // 普票/专票
        invoiceType: InvoiceType.normal,

        // 发票税号
        taxNo: '',

        // 发票抬头
        invoiceTitle: '',

        // 抬头信息
        companyCheckInfoArr: [ ],

        /** 刷新 */
        refresh: '',

        /** 发票地址信息 */
        addressDetail: null,

        /** 已选的地址id */
        addressId: '',

        /** 是否选择过发票抬头，并匹配底下的信息 */
        hasChoiceTitle: false

    },

    runComputed( ) {
        computed( this, {

            formMeta1$: function( ) {

                const { invoiceType, type } = this.data;

                return [
                    {
                        key: 'type',
                        label: '发票类型',
                        type: 'inline-singleselect',
                        value: InvoiceChoiceType.company,
                        options: [
                            {
                                value: InvoiceChoiceType.company,
                                label: '企业'
                            }, {
                                value: InvoiceChoiceType.personal,
                                label: '个人'
                            }, {
                                value: InvoiceChoiceType.noneed,
                                label: '无需'
                            }
                        ],
                        rules: [{
                            validate: val => !!val,
                            message: '发票类型不能为空'
                        }]
                    }, {
                        key: 'invoiceType',
                        label: '普票/专票',
                        type: 'inline-singleselect',
                        value: invoiceType,
                        hide: type !== InvoiceChoiceType.company,
                        options: [
                            {
                                value: InvoiceType.normal,
                                label: '普票'
                            }, {
                                value: InvoiceType.specail,
                                label: '专票'
                            }
                        ],
                        rules: [{
                            validate: val => !!val,
                            message: '普票/专票不能为空'
                        }]
                    }, {
                        key: 'invoiceTitle',
                        label: '发票抬头',
                        type: 'autocomplete',
                        placeholder: '抬头名称 (输入至少4个字 自动匹配)',
                        value: undefined,
                        query: 'name',
                        showKey:'kpName',
                        fillKey: 'kpName',
                        onConfirm: this.onConfirmTitle,
                        url: `${config.host.default}/apis/common/company-check`,
                        hide: type === InvoiceChoiceType.noneed,
                        rules: type === InvoiceChoiceType.company ? [{
                          validate: val => !!val,
                          message: '发票抬头不能为空'
                        }] : [ ]
                    }, {
                        key: 'taxNo',
                        label: '税号',
                        type: 'input',
                        width: '100rpx',
                        hide: type !== InvoiceChoiceType.company,
                        placeholder: '纳税人识别号或社会统一征信代码',
                        value: undefined,
                        rules: [{
                          validate: val => !!val,
                          message: '税号不能为空'
                        }]
                    }
                ];
            },

            formMeta2$: function( ) {
                const { invoiceType } = this.data; 
                return [
                    {
                        key: 'openingBank',
                        label: '开户银行',
                        type: 'input',
                        placeholder: invoiceType === InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === InvoiceType.specail ? [{
                          validate: val => !!val,
                          message: '开户银行不能为空'
                        }] : [ ]
                    }, {
                        key: 'bankAccount',
                        label: '银行账户',
                        type: 'input',
                        placeholder: invoiceType === InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === InvoiceType.specail ? [{
                          validate: val => !!val,
                          message: '银行账户不能为空'
                        }] : [ ]
                    }, {
                        key: 'enterpriseAddress',
                        label: '企业地址',
                        type: 'input',
                        placeholder: invoiceType === InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === InvoiceType.specail ? [{
                          validate: val => !!val,
                          message: '企业地址不能为空'
                        }] : [ ]
                    }, {
                        key: 'enterpriseTelephone',
                        label: '企业电话',
                        type: 'input',
                        placeholder: invoiceType === InvoiceType.specail ? '必填' : '选填',
                        value: undefined,
                        rules: invoiceType === InvoiceType.specail ? [{
                          validate: val => !!val,
                          message: '企业电话不能为空'
                        }] : [ ]
                    }
                ];
            }

        }); 
    },

    /** 监听 */
    watchApp( ) {
        app.watch$('Common.isIPhoneX', v => {
             // 兼容iponeX
            this.setData!({
                isIPhoneX: v
            }) 
        });
    },

    /** 编辑状态，初始化表单 */
    initEdit( ) {

        const this_: any = this;
        const form1 = this_.selectComponent('#form1');
        
        const lastForm: any = app.store.Form.orderInvoice;
        const { type, invoiceType, taxNo, invoiceTitle, addressDetail,
            openingBank, bankAccount, enterpriseAddress, enterpriseTelephone } = lastForm;

        if ( !!addressDetail && !!addressDetail.id ) {
            this.setData!({
                addressId: addressDetail.id
            });
        }
        

        form1.set({
            type,
            taxNo,
            invoiceType,
            invoiceTitle
        });

        setTimeout(( ) => {
            const form2 = this_.selectComponent('#form2');
            if ( !!form2 ) {
                form2.set({
                    openingBank,
                    bankAccount,
                    enterpriseAddress,
                    enterpriseTelephone
                });
            }
            this.setData!({
                inited: true
            });
        }, 100 );

    },

    /** 检查抬头和税号 */
    checkHeaderAndNo( invoiceTitle, taxNo ) {
        const { type } = this.data;

        if ( type !== InvoiceChoiceType.company ) { return; }
        if ( !invoiceTitle || !taxNo ) { return; }

        http({
            errMsg: 'none',
            loadingMsg: 'none',
            path: `/apis/common/company-check?name=${invoiceTitle}`
        }).then( res => {
            const { status, data } = res;
            if ( status !== 200 ) { return; }
            this.setData!({
                companyCheckInfoArr: data
            });
        });
    },

    /** 表单表更 */
    onFormChange({ detail }) {
        const { type, invoiceTitle, taxNo, invoiceType } = detail;

        if ( taxNo !== this.data.taxNo || invoiceTitle !== this.data.invoiceTitle ) {
            // 不需要这样的匹配校验了
            // this.checkHeaderAndNo( invoiceTitle, taxNo );

            this.setData!({
                hasChoiceTitle: false
            });
        }

        if ( invoiceType !== this.data.invoiceType ) {
            // this.onCheckForm2( );
        }

        this.setData!({
            invoiceType,
            type,
            taxNo: taxNo || '',
            invoiceTitle: invoiceTitle || '',
        });
    },

    /** 提交 */
    onSubmit( ) {
        const { addressDetail } = this.data;
        const { result, data } = this.onCheckAll( );
        if ( !result ) { return; }

        // 信息存起来
        app.set$('Form.orderInvoice', {
            ...data,
            addressDetail
        });

        wx.navigateBack({
            delta: 1
        })
    },

    /** 检查开票信息 */
    onCheckKp( ) {
        const this_: any = this;
        const { companyCheckInfoArr, invoiceTitle, taxNo, type } = this_.data;

        if ( type !== InvoiceChoiceType.company ) {
            return '';
        }

        if ( companyCheckInfoArr.length === 0 ) {
            return '请核对企业名称'

        } else if ( companyCheckInfoArr.length === 1 ) {

            const { kpName, kpCode } = (companyCheckInfoArr[ 0 ] as any);
            if ( kpName !== invoiceTitle ) {
                return '请核对企业名称';
            } else if ( kpCode !== taxNo ) {
                return '税号错误，请核对';
            }
    
        } else if ( companyCheckInfoArr.length > 1 ) { 
            const target = companyCheckInfoArr.find( x => x.kpName === invoiceTitle );
            if ( !target ) {
                return '请核对企业名称';
            } else {
                return target.kpCode !== taxNo ? '税号错误，请核对' : '';
            }
        }
        return '';
    },

    /** 检查所有表单 */
    onCheckAll( ) {

        const this_: any = this;
        const { addressDetail, type, hasChoiceTitle } = this.data;
        const form1 = this_.selectComponent('#form1');
        const form2 = this_.selectComponent('#form2');

        const res1 = form1.getData( );
        const res2 = form2 ? form2.getData( ) : { result: true };

        const err = title => {
            wx.showToast({
                title,
                icon: 'none',
            });
            return {
                result: false,
                data: {
                    ...res1.data,
                    ...res2.data
                }
            }
        }

        /**
         * 检查表单
         */
        if ( !res1.result || !res2.result ) {
            return err('请完善表单');
        }

        /**
         * 检查抬头、税号
         */
        if ( type === InvoiceChoiceType.company ) {
            if ( !hasChoiceTitle ) {
                return err('请选择正确抬头');
            }
        }

        /**
         * 检查发票地址
         */
        if ( type !== InvoiceChoiceType.noneed && !addressDetail ) {
            return err('收票地址不能为空');
        }

        return {
            result: true,
            data: {
                ...res1.data,
                ...res2.data,
                invoiceTitle: res1.data.invoiceTitle || '个人'
            }
        }

    },

    /** 检查标单 */
    onCheckForm2( ) {
        const this_: any = this;
        const form2 = this_.selectComponent('#form2');
        if ( !!form2 ) {
            setTimeout(( ) => {
                form2.getData( );
            }, 100 );
        }
    },

    /** 地址选择 */
    onAddressChange({ detail }) {
        this.setData!({
            addressDetail: detail
        });
    },

    /** 选择了发票抬头公司 */
    onConfirmTitle( e ) {
        const { kpCode, accountBlank, bankAccount, kpAddr, kpTel, kpName } = e;
        const this_: any = this;
        const form1 = this_.selectComponent('#form1');
        const form2 = this_.selectComponent('#form2');
    
        form1.set({
            taxNo: kpCode,
            invoiceTitle: kpName
        });

        !!form2 && form2.set({
            openingBank: accountBlank,
            bankAccount: bankAccount,
            enterpriseAddress: kpAddr,
            enterpriseTelephone: kpTel
        });

        this.setData!({
            hasChoiceTitle: true
        });
    },

    onLoad( query: any ) {
        const { editing, defaultAddress } = query;

        this.watchApp( );
        this.runComputed( );

        if ( editing === '1' ) {
            this.initEdit( );
        } else {
            this.setData!({
                inited: true,
                addressId: defaultAddress || ''
            });
        }
        
    },

    onShow( ) {
        this.setData!({
            refresh: (Math.random( ) * 9999).toFixed( 0 )
        })
    }
})
