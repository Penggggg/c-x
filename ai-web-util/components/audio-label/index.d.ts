/// <reference types="react" />
import './index.less';
declare type labelTag = {
    id: string;
    name: string;
    [key: string]: any;
};
interface AudioLabelProps {
    tags: labelTag[];
    canAction?: boolean;
    defaultSelected: labelTag[];
    onCreate?: (name: string) => void;
    onDelete?: (tag: labelTag) => void;
    onUpdate?: (tag: labelTag) => void;
    onSave?: (selectedTags: labelTag[]) => void;
}
export declare const AudioLabel: ({ tags, canAction, defaultSelected, onCreate, onDelete, onUpdate, onSave }: AudioLabelProps) => JSX.Element;
export {};
