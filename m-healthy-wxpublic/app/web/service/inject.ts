import { Observer } from 'mobx-vue';
import { mappingStore } from '../store';

export const inject = ( injectOpt: injectArg ) => {
    return view => {
        if ( Array.isArray( injectOpt.selector )) {
            injectOpt.selector.map( storeName => {
                view.prototype[ storeName ] = mappingStore[ storeName ];
            });
        }
        return Observer( view );
    };
};

type injectArg = {
    providers?: any
    selector?: (keyof typeof mappingStore)[ ]
};

