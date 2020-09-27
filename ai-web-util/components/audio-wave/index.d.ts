import React from 'react';
import WaveSurfer from 'wavesurfer.js';
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
interface Region {
    id: string;
    label: string;
    start: number;
    end: number;
    wavesurfer: WaveSurfer;
    [key: string]: any;
}
interface Props {
    url: string;
    canAction: boolean;
    labeledList: Array<labelContent>;
    onRegionChange: (region: Region, regions?: Array<Region>) => void;
}
export declare const AudioWave: React.ForwardRefExoticComponent<Props & React.RefAttributes<unknown>>;
export {};
