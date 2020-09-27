
declare namespace C {

    /** 动态表单 */
    export namespace PosterGenerator {

        export type imgs = {
            src?: string,
            left?: number,
            top: number,
            imgele?: any
            center?: boolean,
            width?: number,
            height?: number
        }[ ]

        export type texts = {
            text: string,
            left?: number,
            top: number,
            center?: boolean;
            fontsize?: number
        }[ ]

    }
}