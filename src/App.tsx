import React, {useContext, useState} from 'react';


interface IUser {
    name: string;
    age?: number;
}

interface IAppState {
    user: IUser;
}

interface ContextType {
    appState: IAppState;
    setAppState: (state: IAppState) => void;
}

interface IReducerType {
    type: string;
    payload: IAppState | IUser;
}

const appContext = React.createContext<ContextType | null>(null);


const 大儿子 = () => <section>大儿子<User/></section>;
const 二儿子 = () => <section>二儿子<Wrapper/></section>;
const 幺儿子 = () => <section>幺儿子</section>;


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


const Wrapper = () => {
    const { appState, setAppState } = useContext(appContext) as ContextType;
    const dispatch = (action: IReducerType) => {
        setAppState(reducer(appState, action));
    };
    return <UserModifier dispatch={dispatch} state={appState} />;
};

const User = () => {
    const { appState } = useContext(appContext) as ContextType;
    return (
        <div> User:{ appState.user.name } </div>
    );
};

const UserModifier = ({dispatch, state} : any) => {
    //const contextValue = useContext(appContext) as ContextType;
    const onChange = (e: any) => {

        //contextValue.setAppState(reducer(contextValue.appState, {type: 'updateUser', payload: { name: e.target.value }}));
        dispatch({type: 'updateUser', payload: { name: e.target.value }});
  };
  return (
    <div>
      <input value={ state.user.name }
             onChange={onChange}/>
    </div>);
};


export const App: React.FC = () => {
    const [ appState, setAppState ] = useState<IAppState>({
        user: { name: 'chain', age: 33 },
    });
    //const contextValue = { appState, setAppState };
    return (
        <appContext.Provider value={{ appState, setAppState }} >
          <大儿子/>
          <二儿子/>
          <幺儿子/>
        </appContext.Provider>
      );
};

