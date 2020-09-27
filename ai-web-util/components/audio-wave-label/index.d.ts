/// <reference types="react" />
import './index.less';
declare type labelTag = {
    id: string;
    name: string;
    [key: string]: any;
};
declare type labelContent = {
    id?: string;
    label: string;
    start: number;
    end: number;
    tags?: labelTag[];
};
interface Props {
    url: string;
    canAction: boolean;
    tags: Array<any>;
    labeledList: Array<labelContent>;
    onCreateLabel: (value: any) => void;
    onUpdateLabel: (value: any) => void;
    onDeleteLabel: (value: any) => void;
    onSave: (result: labelContent[]) => void;
}
export declare const AudioWaveLabel: ({ url, labeledList, tags, canAction, onCreateLabel, onUpdateLabel, onDeleteLabel, onSave }: Props) => JSX.Element;
export {};
