import { connect, IAppState } from '../redux';

const userSelector = (state: any) => {
    return { user: state.user };
};

const userDispatcher = (dispatch: any) => {
    return {
        updateUser: (attrs: IAppState) => dispatch({ type: 'updateUser', payload: attrs }),
    };
};

export const connectToUser = connect(userSelector, userDispatcher);
