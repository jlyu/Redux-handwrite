import React, { useContext, useEffect, useState } from 'react';

interface IUser {
    name: string;
    age: number;
}

interface IAppState {
    user: IUser;
}

interface IStoreType {
    state: IAppState;
    setState: (state: IAppState) => void;
    listeners: any[];
    subscribe: (fn: any) => void;
}

interface IReducerType {
    type: string;
    payload: IAppState | IUser;
}

export const connect = (Component: React.FC<any>) => {
    return (props: React.ComponentProps<typeof Component>) => {
        const { state, setState } = useContext(appContext) as IStoreType;
        const [, update] = useState({});

        useEffect(() => {
            store.subscribe(() => {
                update({});
            });
        }, []);

        const dispatch = (action: IReducerType) => {
            setState(reducer(state, action));
        };
        return <Component {...props} dispatch={dispatch} state={state} />;
    };
};

const reducer = (state: IAppState, { type, payload }: IReducerType) => {
    if (type === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload,
            },
        };
    } else {
        return state;
    }
};

export const store: IStoreType = {
    state: { user: { name: 'chain', age: 33 } },
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

export const appContext = React.createContext<IStoreType | null>(null);
