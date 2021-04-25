import { connect, IAppState } from '../redux';

const ajax = async (sPath: string) => {
    if (!sPath) {
        return undefined;
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ data: { name: 'Chain. from 3 seconds later' } });
        }, 3000);
    });
};

const fetchUser = (dispatch: any) => {
    ajax('/user')
        .then((response: any) => {
            dispatch({ type: 'updateUser', payload: response.data });
        })
        .catch();
};

const userSelector = (state: any) => {
    return { user: state.user };
};

const userDispatcher = (dispatch: any) => {
    return {
        updateUser: (attrs: IAppState) => dispatch({ type: 'updateUser', payload: attrs }),
        fetchUser: () => dispatch(fetchUser), //fetchUser(dispatch),
    };
};

export const connectToUser = connect(userSelector, userDispatcher);
