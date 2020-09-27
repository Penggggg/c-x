<template>
    <div class="con-poster-generator">

        <canvas
            :id="canvasId"
            :style="canvasStyle"
        />

        <img
            :src="img"
            :id="imgId"
            class="origin-img"
        >

        <img 
            :src="imgBase"
            v-if="imgBase"
            class="img-result"
        />

    </div>
</template>
<script lang="ts">
/// <reference path="./index.d.ts" />
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

/**
 * @description 
 * “海报生成器”
 */

@Component({
    components: {
    }
})
export default class C extends Vue {

    /** 主体图片 */
    @Prop({ type: String, required: true })
    img!: string;

    /** 要嵌入的图片列表 */
    @Prop({ type: Array, default: ( ) => [ ]})
    imgs!: C.PosterGenerator.imgs;

    /** 要嵌入的文字列表 */
    @Prop({ type: Array, default: ( ) => [ ]})
    texts!: C.PosterGenerator.texts;

    /** 图片宽高 */
    private imgStyle = {
        width: 0,
        height: 0
    };

    /** canvas宽高 */
    private canvasStyle = {
        
    }

    /** canvas转换的base64 */
    private imgBase = '';

    @Watch('imgs')
    onChange2( val ) {
        this.initBgImg( );
    }

    @Watch('texts')
    onChange1( val ) {
        this.initBgImg( );
    }

    /** canvas-id */
    private canvasId = Math.ceil(Math.random( ) * 10000);

    /** image-id */
    private imgId = Math.ceil(Math.random( ) * 10000);

    /** 描写图片 */
    private canvasDraw( image, positionx, positiony, width, height ) {
        const canvas = document.getElementById( String( this.canvasId ));
        (canvas as any).getContext("2d").drawImage( image, positionx, positiony, width, height );
    }

    /** 初始化背景图 */
    private initBgImg( ) {

        const img = new Image( );
        const image = document.getElementById( String( this.imgId ));
        const canvas = document.getElementById( String( this.canvasId ));

        img.src= this.img;  
        img.onload = ( ) => {  
            const width = (image as any).width;
            const height = (image as any).height;
            this.imgStyle = {
                width,
                height
            };
            this.canvasStyle = {
                width: `${Math.ceil( width )}px`,
                height: `${Math.ceil( height )}px`
            };
            (canvas as any).width = Math.ceil( width * 2 );
            (canvas as any).height = Math.ceil( height * 2 );
            this.canvasDraw( image, 0, 0, Math.ceil( width * 2 ), Math.ceil( height * 2 ) );
            this.drawOtherImgs( );
            this.drawText( );
        }
    }

    /** 绘制图片 */
    private drawOtherImgs( ) {
        const { width, height } = this.imgStyle;
        this.imgs.map( imgItem => {
            if ( imgItem.src ) {
                const img = new Image( );
                img.src = imgItem.src;
                img.onload = ( ) => {
                 
                    if ( !imgItem.center ) {
                        this.canvasDraw( img, (imgItem as any).left * width * 2, imgItem.top * height * 2, imgItem.width || 250, imgItem.height || 250 );
                    } else {
                        const left = 0.5 * width * 2 - ( 250 / 2);
              
                        this.canvasDraw( img, left, imgItem.top * height * 2, imgItem.width || 250, imgItem.height || 250 );
                        
                    }
                    this.makeImg( document.getElementById( String( this.canvasId )));
                };
            } else if ( imgItem.imgele ) {
                if ( !imgItem.center ) {
                    this.canvasDraw( imgItem.imgele, (imgItem as any).left * width * 2, imgItem.top * height * 2, imgItem.width || 250, imgItem.height || 250 );
                } else {
                    const left = 0.5 * width * 2 - ( 250 / 2);
                    this.canvasDraw( imgItem.imgele, left, imgItem.top * height * 2, imgItem.width || 250, imgItem.height || 250 );
                }
            }
            this.makeImg( document.getElementById( String( this.canvasId )));
        });
    }

    /** 绘制文字 */
    private drawText( ) {
        const { width, height } = this.imgStyle;
        const canvas = document.getElementById( String( this.canvasId ))
        this.texts.map( textItem => {
            const ctx = (canvas as any).getContext("2d");

            let font = textItem.fontsize || 60;

            if ( !textItem.fontsize ) {
                if ( textItem.text.length > 10 ) {
                    font = 60;
                } else if ( textItem.text.length > 10 && textItem.text.length <= 15 ) {
                    font = 40;
                } else if ( textItem.text.length > 15 ) {
                    font = 30;
                }
            }

            ctx.font = `${font}px Verdana`;
            ctx.fillStyle = "White";
            
            if ( !textItem.center ) {
                ctx.fillText( textItem.text, (textItem.left as number) * width * 2, textItem.top * height * 2 );

            } else {
                const left = 0.5 * width * 2 - (textItem.text.length / 2) * font ;
                ctx.fillText( textItem.text, left, textItem.top * height * 2 );
            }
            
        });
        this.makeImg( document.getElementById( String( this.canvasId )));
    }

    /** 创建图片 */
    private makeImg( canvas ) {
        const image = new Image();  
        this.imgBase = canvas.toDataURL("image/png");   
    }

    mounted( ) {
        setTimeout( this.initBgImg, 0 );  
    }

}
</script>
<style lang="less">
@import './index.less';
</style>

