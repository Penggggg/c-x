declare namespace C {

    /** 动态表单 */
    export namespace MyForm {

        type formValue = string | number | Date | string[ ] | boolean | undefined;

        type formData = {
            [ key: string ]: formValue
        }

        export type meta = {
            key: string,
            label: string,
            tips?: string,
            url?: string,
            /** 验证码时必填 */
            saveKey?: string,
            /** 验证码时必填 */
            phonekey?: string,
             /** 验证码时选填 */
            smsCountryKey?: string
            type: 'input' | 'number' | 'select' | 'date' | 'verifycode' | 'radio' | 'encryption' | 'date2' | 'dateTime ' | 'checkbox',
            /** encryption时选填 */
            encryptions?: [ number, number ][ ]
            value?: formValue,
            options?: {
                label: string,
                value: string
            }[ ],
            disabled?: boolean,
            color?:string,
            onChange?: (val) => void,
            rules?: {
                validate: ( val: formValue, formData: formData ) => boolean,
                message: string
            }[ ]
        }[ ][ ] 

    }
}