import { useMethods } from './useMethods';

const arrayMethods = {
    push< T >( state: T[ ], item: T ) {
        return state.concat(item);
    },
    pop< T >( state: T[ ]) {
        return state.slice( 0, -1);
    },
    slice< T >( state: T[ ], start: number, end: number ) {
        return state.slice(start, end);
    },
    empty< T >( state: T[ ]): T[ ] {
        return [ ];
    },
    set< T >( state: T[ ], newValue: T[ ]) {
        return newValue;
    },
    remove< T >( state: T[ ], item: T ) {
        const index = state.indexOf( item );
        if ( index < 0 ) {
            return state;
        }
        return [...state.slice( 0, index ), ...state.slice( index + 1 )];
    }
}

export const useArray = < T >( initVal: T[ ] = [ ]) => {
    return useMethods( initVal, arrayMethods )   
}