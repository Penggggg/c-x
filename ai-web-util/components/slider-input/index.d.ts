/// <reference types="react" />
import { SliderMarks } from 'antd/lib/slider';
import './index.less';
interface Props {
    min: number;
    max: number;
    step?: number;
    defaultValue: number;
    preIcon?: string;
    sufIcon?: string;
    disabled?: boolean;
    marks?: SliderMarks | undefined;
    onChange: (value: number) => void;
}
export declare const SliderInput: ({ min, max, step, defaultValue, preIcon, sufIcon, disabled, marks, onChange }: Props) => JSX.Element;
export {};
