declare namespace C {

    /** 动态表单 */
    export namespace WechatNav {

        export type meta = {
            label: string,
            url?: string,
            open?: boolean,
            children?: {
                label: string,
                url?: string,
            }[ ]
        }[ ]

    }

}