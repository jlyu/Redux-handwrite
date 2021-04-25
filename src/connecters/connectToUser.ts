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

const fetchUser = async (dispatch: any) => {
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
        asyncFetchUser: () => dispatch(fetchUser), //fetchUser(dispatch),
        promiseFetchUser: () => dispatch({ type: 'updateUser', payload: ajax('/user').then((response: any) => response.data) }),
    };
};

export const connectToUser = connect(userSelector, userDispatcher);
