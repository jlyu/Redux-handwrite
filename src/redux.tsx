import React, { useContext, useEffect, useState } from 'react';

interface IUser {
    name: string;
    age: number;
}

export interface IAppState {
    user: IUser;
    group: object;
}

type ReducerType = (state: IAppState, { type, payload }: IReducerType) => IAppState;

interface IStoreType {
    getState: () => IAppState;
    //setState: (state: IAppState) => void;
    dispatch: (action: IReducerType) => void;
    subscribe: (fn: any) => void;
}

export interface IReducerType {
    type: string;
    payload: IAppState | IUser;
}


const changed = (oldState: IAppState, newState: IAppState) => {
    for (const key in oldState) {
        if (oldState[key as keyof IAppState] !== newState[key as keyof IAppState]) {
            return true;
        }
    }
    return false;
};

let state: IAppState;
let reducer: ReducerType;
const listeners: any[] = [];

const setState = (newState: IAppState) => {
    state = newState;
    listeners.map((fn) => fn(state));
};

const store: IStoreType = {
    getState() { return state; },
    dispatch(action: IReducerType) {
        setState((reducer as ReducerType)(state as IAppState, action));
    },

    subscribe(fn) {
        listeners.push(fn);
        return () => {
            const index = listeners.indexOf(fn);
            listeners.splice(index, 1);
        };
    },
};

export const createStore = (initReducer: ReducerType, initState: IAppState) => {
    reducer = initReducer;
    state = initState;
    return store;
};

export const connect = (selector: any, mapDispatchToProps: any) => (Component: React.FC<any>) => {
    return (props: React.ComponentProps<typeof Component>) => {
        const [, update] = useState({});
        const data = selector ? selector(state) : {state};

        // const dispatch = (action: IReducerType) => {
        //     setState((reducer as ReducerType)(state as IAppState, action));
        // };

        const dispatchers = mapDispatchToProps ? mapDispatchToProps(store.dispatch) : { dispatch: store.dispatch };

        useEffect(() => store.subscribe(() => {
            const newData = selector ? selector(state) : { state: state };
            if (changed(data, newData)) {
                update({});
            }
        }), [selector]);

        return <Component {...props} {...data} {...dispatchers} />;
    };
};

export const appContext = React.createContext<IStoreType | null>(null);

export const Provider = ({store, children}: any) => {

    return <appContext.Provider value={store} >
                {children}
           </appContext.Provider>;
};
