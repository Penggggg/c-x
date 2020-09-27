import React, { createContext, useContext } from 'react';
/** 创建 Mobx Store */
export var createStore = function (store) {
    var ctx = createContext({});
    return {
        useStore: function () { return useContext(ctx); },
        StoreProvider: function (_a) {
            var children = _a.children;
            return (React.createElement(ctx.Provider, { value: store }, children));
        }
    };
};
