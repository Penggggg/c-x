/// <reference types="react" />
declare type labelTag = {
    id: string;
    name: string;
    [key: string]: any;
};
interface Props {
    id?: string;
    regions: Array<any>;
    canAction: boolean;
    tags: labelTag[];
    onDelete: Function;
    onRowClick: Function;
    onSave: (value: any) => void;
    onCreateLabel: (value: any) => void;
    onUpdateLabel: (value: any) => void;
    onDeleteLabel: (value: any) => void;
    onLabelChange: (event: any) => void;
}
export declare const AudioLabelTable: ({ id, regions, canAction, tags, onDelete, onCreateLabel, onUpdateLabel, onDeleteLabel, onLabelChange, onSave, onRowClick }: Props) => JSX.Element;
export {};
