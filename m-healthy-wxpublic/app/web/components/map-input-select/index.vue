<template>
    <div class="c-map-input-select">
        <my-drawer
            title="输入搜索"
            :show.sync="theShow"
        >
            <span
                slot="right"
                @click="sure"
                class="btn-right"
            >
                确定
            </span>
            <div class="container">
                
                <div class="map" id="map"></div>

                <div
                    id="r-result"
                    class="r-result"
                >
                    <input type="text" id="suggestId" placeholder="请输入地址..." value="" />
                </div>

                <div
                    id="searchResultPanel"
                    class="searchResultPanel"
                    style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"
                ></div>

            </div>
        </my-drawer>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MyDrawer from '../my-drawer/index.vue';
import { setTimeout } from 'timers';

/**
 * @description 
 * “地图输入搜索”
 * 用法
 * <map-input-select
        :show.sync="show"
        @confirm="mapChoice"
    />
 */

@Component({
    components: {
        MyDrawer
    }
})
export default class C extends Vue {

    @Prop({ type: Boolean, required: true })
    show!: boolean;

    /** 返回结果 */
    private result;

    /** 地图用的 */
    private map;
    private ac;
    private myValue;
    private myValue_bussiness;
    private myValue_addr;
    private lng;
    private lat;
    private geoc;

    get theShow( ) {
        return this.show;
    }

    set theShow( val ) {
        this.$emit('update:show', val );
    }

    @Watch('show')
    private onShow( show ) {
        setTimeout(( ) => {
            this.initialize( )
        }, 200 );
    }

    /** 确认按钮 */
    private sure( ) {
        this.$emit('confirm', this.result );
        this.$emit('update:show', false );
        this.result = null;
    }

    /** 点击地址，选择目的地 */
    private onClick( result ) {
        this.result = result;
    }
    
    private initialize( ) {  

        this.map = new (window as any).BMap.Map('map', { enableMapClick: true });
        const point = new (window as any).BMap.Point( 116.331398,39.897445 );
        this.map.centerAndZoom( point, 12 );  
        this.map.enableScrollWheelZoom( true );

        this.geoc = new (window as any).BMap.Geocoder( );

        const myFunc = result => {
            this.map.setCenter(result.name);
        }

        const myCity = new (window as any).BMap.LocalCity();
        myCity.get( myFunc );

        this.ac = new (window as any).BMap.Autocomplete(    //建立一个自动完成的对象
                {"input" : "suggestId"
                ,"location" : this.map
        });
        
        this.ac.addEventListener("onhighlight", e => {  //鼠标放在下拉列表上的事件
            let str = "";
            let _value = e.fromitem.value;
            let value = "";
            if (e.fromitem.index > -1) {
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;
            
            value = "";
            if (e.toitem.index > -1) {
                _value = e.toitem.value;
                value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
            }    
            str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
            (document as any).getElementById('searchResultPanel').innerHTML = str;
        });
        
        this.ac.addEventListener("onconfirm", e => {    //鼠标点击下拉列表后的事件
            let _value = e.item.value;
            this.myValue = _value.province +  _value.city +  _value.district +  _value.street + _value.business;
            this.myValue_bussiness =  _value.business;
            this.myValue_addr = _value.province +  _value.city +  _value.district +  _value.street + _value.streetNumber;
                (document as any).getElementById('searchResultPanel').innerHTML ="onconfirm<br />index = " + e.item.index + "<br />myValue = " + this.myValue;
                this.setPlace( );
        });
    }

    private setPlace( ) {
        this.map.clearOverlays( ); 
        const local = new (window as any).BMap.LocalSearch( this.map, { //智能搜索
            onSearchComplete: ( ) => {
                let pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
                this.lat = pp.lat;
                this.lng = pp.lng;
                this.map.centerAndZoom(pp, 18);
                const marker = new (window as any).BMap.Marker(pp);
                marker.addEventListener("click", ( ) => {
                    const infoWindow = new (window as any).BMap.InfoWindow(`地址：${addr}`, opts);  // 创建信息窗口对
                    this.map.openInfoWindow(infoWindow, pp);
                });
                this.map.addOverlay(marker);    //添加标注

                var opts = {
                    width : 200,     // 信息窗口宽度
                    height: 100,     // 信息窗口高度
                    title : this.myValue_bussiness , // 信息窗口标题
                }
                let addr = '';

                this.geoc.getLocation(pp, rs => {
                    let addComp = rs.addressComponents;
                    this.onClick( Object.assign({ }, rs, {
                        search: (document.getElementById('suggestId') as any).value
                    }));
                    addr = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                    this.myValue_addr = addr;
                });
            } 
        });
        local.search( this.myValue );
    }

}

</script>
<style lang="less">
@import './index.less';
</style>

