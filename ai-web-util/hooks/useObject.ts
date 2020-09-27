import { useMethods } from './useMethods';

const objMethods = {
    set< T >( state: T, newValue: T ) {
        return newValue;
    }
}

export const useObject = < T >( initVal: T | { } = { }) => {
    return useMethods( initVal, objMethods )   
}