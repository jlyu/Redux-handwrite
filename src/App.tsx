import React, {useContext, useEffect, useState} from 'react';


interface IUser {
    name: string;
    age: number;
}

interface IAppState {
    user: IUser;
}

// interface IContextType {
//     appState: IAppState;
//     setAppState: (state: IAppState) => void;
// }

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

const appContext = React.createContext<IStoreType | null>(null);

const store: IStoreType = {
    state: { user: { name: 'chain', age: 33 } },
    setState(newState: IAppState) {
        store.state = newState;
        store.listeners.map(fn => fn(store.state));
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
const reducer = (state: IAppState, { type, payload }: IReducerType ) => {
    if (type === 'updateUser') {
        return {
            ...state,
            user: {
                ...state.user,
                ...payload
            }
        };
    } else {
        return state;
    }
};

const connect = (Component: React.FC<any>) => {
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
            //update({}); // force render
        };
        return <Component {...props} dispatch={dispatch} state={state} />;
    };
};

const FirstSon = () => <section>FirstSon<User/></section>;
const SecondSon = () => <section>SecondSon<UserModifier>Child</UserModifier></section>;
const LittleSon = () => <section>LittleSon</section>;

const User = connect(({state, children}: React.ComponentProps<typeof User>) => {
    return (
        <div> {children} User:{ state.user.name } </div>
    );
});
const UserModifier = connect(({dispatch, state, children}: React.ComponentProps<typeof UserModifier>) => {
    const onChange = (e: any) => {
        dispatch({type: 'updateUser', payload: { name: e.target.value }});
    };
    return (
        <div>
        {children}
        <input value={ state.user.name }
                onChange={onChange}/>
        </div>
    );
});

export const App: React.FC = () => {
    // const [ appState, setAppState ] = useState<IAppState>({
    //     user: { name: 'chain', age: 33 },
    // });
    return (
        <appContext.Provider value={store} >
          <FirstSon/>
          <SecondSon/>
          <LittleSon/>
        </appContext.Provider>
      );
};

