import React, {useContext, useState, JSXElementConstructor} from 'react';


interface IUser {
    name: string;
    age?: number;
}

interface IAppState {
    user: IUser;
}

interface IContextType {
    appState: IAppState;
    setAppState: (state: IAppState) => void;
}

interface IReducerType {
    type: string;
    payload: IAppState | IUser;
}

const appContext = React.createContext<IContextType | null>(null);


const FirstSon = () => <section>FirstSon<User/></section>;
const SecondSon = () => <section>SecondSon<UserModifier>Child</UserModifier></section>;
const LittleSon = () => <section>LittleSon</section>;


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
        const { appState, setAppState } = useContext(appContext) as IContextType;
        const dispatch = (action: IReducerType) => {
            setAppState(reducer(appState, action));
        };
        return <Component {...props} dispatch={dispatch} state={appState} />;
    };
};


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
    const [ appState, setAppState ] = useState<IAppState>({
        user: { name: 'chain', age: 33 },
    });
    //const contextValue = { appState, setAppState };
    return (
        <appContext.Provider value={{ appState, setAppState }} >
          <FirstSon/>
          <SecondSon/>
          <LittleSon/>
        </appContext.Provider>
      );
};

