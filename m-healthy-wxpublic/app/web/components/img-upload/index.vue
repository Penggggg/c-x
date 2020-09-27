<template>
    <div class="c-img-upload">

    <div class="file-list">

        <transition-group name="list" tag="ul" :style="{ display: 'flex' }" class="img-list">
            <li v-for="(img, index) in imgList" :key="index" class="file-item draggable-item">
                <img :src="img" alt="" ondragstart="return false;">
                <span class="file-remove" @click="e => remove(index)">×</span>
            </li>
            <li key="9999999" class="file-item draggable-item">
                <div class="upload-btn">
                    <span>+</span>
                    <input type="file" accept="image/*" @change="onFileChange" >
                </div>
            </li>
        </transition-group>

    </div>

    </div>
</template>
<script lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({ })
export default class ImgUpload extends Vue {

    /** iac字符串 */
    private iac = '';

    /** 正在显示的图片列表 */
    private imgList: any = [ ];

    /** 已上传的图片信息 */
    private hasUpdateList: any = [ ];

    /**是否需要iac  */
    @Prop({ type: Boolean, required: false, default: true }) needIac!: boolean;

    /** 请求路径 - iac */
    @Prop({ type: String, required: true }) iacReqUrl!: string

    /** 最大图片大小 */
    @Prop({ type: Number, required: false, default: 999999999 }) maxSize!: number

    /** 图片大小错误提示 */
    @Prop({ type: String, required: false, default: '' }) maxSizeTips!: string

    /** 插入post-body的data */
    @Prop({ type: Object, required: false, default: function( ) { return { }} }) appendData!: object

    /** 上传地址 */
    @Prop({ type: String, required: true }) uploadUrl!: string;

    /** 把成功上传后的照片，转换为可以显示的图片url */
    @Prop({ type: Function, required: true }) convert!: Function;

    /** 成功语 */
    @Prop({ type: String, required: false, default: '上传成功' }) successMsg!: string;

    /** 获取IAC */
    getIac( needIac, iacReqUrl ) {
        if ( !needIac || !iacReqUrl.trim( )) { return; }
        axios({
            url: this.iacReqUrl
        }).then( req => {
            this.iac = req.data;
        });
    }

    /** 移除已上传的照片 */
    remove( index ) {
        this.imgList.splice( index, 1 );
        this.hasUpdateList.splice( index, 1 );
        this.$emit('file-change', {
            imgList: this.imgList,
            updateList: this.hasUpdateList
        });
    }

    /** 文件上传 */
    onFileChange( e ) {

        const file = e.target.files[ 0 ];
        const size = file.size;
        const formData = new FormData();

        /** 图片大小限制 */
        if ( Math.ceil( size / 2014 ) > Number( this.maxSize )) {
            this.$toast.error( this.maxSizeTips );
            return;
        }

        /** 图片body插入 */
        formData.append('file', file, file.name );
        Object.keys( this.appendData ).map( dataKey => {
            formData.append(`${dataKey}`, this.appendData[ dataKey ]);
        });

        const load = this.loading$.msg('上传中');
        
        /** 正式上传 */
        axios({
            method: 'post',
            data: formData,
            url: this.uploadUrl,
            headers: {
                'x-iac-token': this.iac,
                'Content-Type': 'multipart/form-data'
            }
        }).then( Res => {
            const req = Res.data;

            if ( !!req && ( req.status === '0' || req.status === 200 )) {

                load.close( );
                this.$toast.success('上传成功');
                this.hasUpdateList.push( req );
                this.imgList.push( this.convert( req ));

                this.$emit('file-change', {
                    imgList: this.imgList,
                    uploadList: this.hasUpdateList
                });

            } else {
                this.$toast.error( req.message );
            }
        }).catch( e => {
            load.close( );
            this.$toast.error( '上传失败, 请稍后重试' );
        })

    }

    mounted( ) {
        this.getIac( this.needIac, this.iacReqUrl );
    }

}
</script>

<style lang="less">
@import './index.less';
</style>


