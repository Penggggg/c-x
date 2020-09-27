import React, { createContext, useContext } from 'react';

type TCreateStore = < T >( store: T ) => {
    useStore: ( ) => T
    StoreProvider: ({ children }: any) => JSX.Element
}

/** 创建 Mobx Store */
export const createStore: TCreateStore = store => {
    const ctx = createContext< typeof store >({ } as typeof store );
    return {
        useStore: ( ) => useContext( ctx ),
        StoreProvider: ({ children }: any ) => (
            <ctx.Provider value={ store }>
                { children }
            </ctx.Provider>
        )
    }
}
