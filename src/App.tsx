import * as React from 'react';
import { connectToUser } from './connecters/connectToUser';
import { connect, createStore, IAppState, IReducerType, Provider} from './redux';

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
const initState = {
        user: { name: 'chain', age: 33 },
        group: { name: "FrontEnd" },
};

const gStore = createStore(reducer, initState);


const FirstSon = () => <section>FirstSon<User/></section>;
const SecondSon = () => <section>SecondSon<UserModifier>Child</UserModifier></section>;
const LittleSon = connect((state: IAppState) => {
    return { group: state.group };
}, null) ( ({ group }) => <section>LittleSon Group {group.name}</section> );

const User = connectToUser(({ user }) => {
    return <div> User:{ user.name } </div>;
});

const UserModifier = connectToUser(({updateUser, user, children}: React.ComponentProps<typeof UserModifier>) => {
    const onChange = (e: any) => {
        updateUser({ name: e.target.value });
    };
    return <div>
        {children}
        <input value={ user.name }
                onChange={onChange}/>
        </div>;
});

export const App: React.FC = () => {

    return <Provider store={gStore} >
                <FirstSon/>
                <SecondSon/>
                <LittleSon/>
           </Provider>;
};

