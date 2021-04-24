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
    state?: IAppState;
    reducer?: ReducerType;
    setState: (state: IAppState) => void;
    listeners: any[];
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


const store: IStoreType = {
    state: undefined,
    reducer: undefined,
    setState(newState: IAppState) {
        store.state = newState;
        store.listeners.map((fn) => fn(store.state));
    },
    listeners: [],
    subscribe(fn) {
        store.listeners.push(fn);
        return () => {
            const index = store.listeners.indexOf(fn);
            store.listeners.splice(index, 1);
        };
    },
};

export const createStore = (initReducer: ReducerType, initState: IAppState) => {
    store.reducer = initReducer;
    store.state = initState;
    return store;
};

export const connect = (selector: any, mapDispatchToProps: any) => (Component: React.FC<any>) => {
    return (props: React.ComponentProps<typeof Component>) => {
        const { state, setState } = useContext(appContext) as IStoreType;
        const [, update] = useState({});
        const data = selector ? selector(state) : {state};

        const dispatch = (action: IReducerType) => {
                setState((store.reducer as ReducerType)(state as IAppState, action));
        };

        const dispatchers = mapDispatchToProps ? mapDispatchToProps(dispatch) : { dispatch };

        useEffect(() => store.subscribe(() => {
                const newData = selector ? selector(store.state) : { state: store.state };
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
