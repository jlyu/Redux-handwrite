import React, {useContext, useState} from 'react';


interface IAppState {
    user: {
        name: string;
        age: number;
    };
}

interface ContextType {
    appState: IAppState;
    setAppState: (state: IAppState) => void;
}

const appContext = React.createContext<ContextType | null>(null);

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

const 大儿子 = () => <section>大儿子<User/></section>;
const 二儿子 = () => <section>二儿子<UserModifier/></section>;
const 幺儿子 = () => <section>幺儿子</section>;

const User = () => {
    const contextValue = useContext(appContext) as ContextType;
    return (
        <div> User:{ contextValue.appState.user.name } </div>
    );
};

const UserModifier = () => {
    const contextValue = useContext(appContext) as ContextType;
    const onChange = (e: any) => {
        contextValue.appState.user.name = e.target.value;
        contextValue.setAppState({...contextValue.appState});
  };
  return (
    <div>
      <input value={ contextValue.appState.user.name }
             onChange={onChange}/>
    </div>);
};

