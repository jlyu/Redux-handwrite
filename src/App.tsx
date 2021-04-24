import * as React from 'react';
import { appContext, connect, store } from './redux';


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

    return (
        <appContext.Provider value={store} >
          <FirstSon/>
          <SecondSon/>
          <LittleSon/>
        </appContext.Provider>
      );
};

