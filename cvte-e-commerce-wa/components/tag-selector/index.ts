import { navTo } from '../../utils/route.js';
import { http } from '../../utils/http.js';
import { computed } from '../../lib/vuefy/index.js';

/**
 * @description
 * 标签选择
 */
Component({

    /**
     * 组件的属性列表
     */
    properties: {

        // 选项
        data: {
            type: Array
        },

        // 最大可选
        max: {
            type: Number,
            value: 1
        }
    },
  
    /**
     * 组件的初始数据
     */
    data: {

        // 已选
        selectedIds: [ ]
    },
  
    /**
     * 组件的方法列表
     */
    methods: {

        runComputed( ) {
            computed( this, {
                
                /** 选项 */
                tags$( ) {
                    const { data, selectedIds } = this.data;
                    return data.map(( x: any) => Object.assign({ }, x, {
                        selected: selectedIds.find(( y: any ) => y === x.id )
                    }));
                }
            })
        },

        /** 选择标签 */
        onSelect({ currentTarget }: any ) {
            const { selectedIds, data, max } = (this as any).data;
            const { tag } = currentTarget.dataset;
            
            // 如果是多选
            if ( max > 1 ) {
                if ( selectedIds.includes( tag.id )) {
                    const index = selectedIds.findIndex(( x: any ) => x === tag.id );
                    selectedIds.splice( index, 1 );
                    (this as any).setData({
                        selectedIds: [ ...selectedIds ]
                    });
                } else {
                    selectedIds.push( tag.id );
                    (this as any).setData({
                        selectedIds: [ ...selectedIds ]
                    });
                };
            // 如果是单选
            } else {
                (this as any).setData({
                    selectedIds: [ tag.id ]
                });
            }
            
            // trigger一下
            const allSelected = max > 1 ?
                data.filter(( x: any ) => {
                    return !!selectedIds.find(( y: any ) => y === x.id );
                }) :
                [ tag.id ];
            (this as any).triggerEvent('change', allSelected );
        }
    },

    attached: function( ) {
        this.runComputed( );
    }
})
  