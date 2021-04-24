import * as React from 'react';
import { appContext, connect, IAppState, store } from './redux';


const FirstSon = () => <section>FirstSon<User/></section>;
const SecondSon = () => <section>SecondSon<UserModifier>Child</UserModifier></section>;
const LittleSon = connect((state: IAppState) => {
    return { group: state.group };
}) ( ({ group }) => <section>LittleSon Group {group.name}</section> );

const User = connect((state: IAppState) => {
    return { user: state.user };
}) (({ user }) => {
    return (
        <div> User:{ user.name } </div>
    );
});

const UserModifier = connect(null)(({dispatch, state, children}: React.ComponentProps<typeof UserModifier>) => {
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

