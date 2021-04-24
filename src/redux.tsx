import React, { useContext, useEffect, useState } from 'react';

interface IUser {
    name: string;
    age: number;
}

export interface IAppState {
    user: IUser;
    group: object;
}

interface IStoreType {
    state: IAppState;
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

export const connect = (selector: any, mapDispatchToProps: any) => (Component: React.FC<any>) => {
    return (props: React.ComponentProps<typeof Component>) => {
        const { state, setState } = useContext(appContext) as IStoreType;
        const [, update] = useState({});
        const data = selector ? selector(state) : {state};
        const dispatch = (action: IReducerType) => {
            setState(reducer(state, action));
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
    state: {
        user: { name: 'chain', age: 33 },
        group: { name: "FrontEnd" },
    },
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
