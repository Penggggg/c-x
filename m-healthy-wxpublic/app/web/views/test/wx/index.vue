<template>
    <div class="">
        <button
            @click="wxQrcode"
        >
            二维码
        </button>
        <img
            v-if="qrcodeTicket"
            :src="`https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=${qrcodeTicket}`"
        />
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

@Component({
    components: {
    }
})
export default class RecordBodyCheck extends Vue {

    /** 二维码 */
    private qrcodeTicket = '';

    /** 生成关注二维码 */
    private wxQrcode( ) {
    
        this.http$.get({
            params: {
                q: `dn=DN00402Q40231800037&sc=xicoo&tt=1`
            },
            url: `/api/common/wx-qrcode`
        }).then(( res: any ) => {
            // if ( res.status === 200 ) {
                this.qrcodeTicket = ( res.ticket );
            // }
        });
    }

    mounted( ) {

    }
}
</script>

