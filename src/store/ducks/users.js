import axiosInstance from '../../interseptor';
import {backendURL} from '../../utils/api';
import {showMessage} from './main';
import {goBack} from '../../services/navigationService';
const SET_USERS = 'toptal/user/setUsers';
const SET_SELECTED_USER = 'toptal/user/setSelectedUser';
const USERS_ARE_LOADING = 'toptal/user/usersAreLoading';
const UPDATE_USER = 'toptal/user/updateUser';
const USER_IS_UPDATING = 'toptal/user/userIsUpdating';
const DELETE_USER = 'toptal/user/deleteUser';
const USER_IS_DELETING = 'toptal/user/userIsDeleting';
const CREATE_USER = 'toptal/user/createUser';
const USER_IS_CREATING = 'toptal/user/userIsCreating';

//იფიქრე იქნებ რედაქსიდან showMessage საერთოდ ამოიღო და ინტერსეფტორში გქონდეს ერრორ ჰენდლინგი
const initialState = {
  users: {},
  selectedUser: null,
  usersAreLoading: false,
  userIsDeleting: false,
  userIsUpdating: false,
  userIsCreating: false,
};

const users = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case SET_USERS:
      const userList = {};
      const selectedUser = state.selectedUser;
      payload.forEach((el) => {
        userList[el.uid] = {
          ...el,
        };
      });
      return {
        ...state,
        users: userList,
        selectedUser: selectedUser ? {...userList[selectedUser.id]} : null,
      };
    case SET_SELECTED_USER:
      return {
        ...state,
        selectedUser: payload,
      };
    case USERS_ARE_LOADING:
      return {
        ...state,
        usersAreLoading: payload,
      };
    case DELETE_USER:
      const temp = {...state.users};
      temp.hasOwnProperty(payload) && delete temp[payload];
      return {
        ...state,
        users: temp,
      };
    case USER_IS_DELETING:
      return {
        ...state,
        userIsDeleting: payload,
      };
    case CREATE_USER:
      return {
        ...state,
        users: {
          ...state.users,
          ...{
            [payload.uid]: {
              ...payload,
            },
          },
        },
      };
    case USER_IS_CREATING:
      return {
        ...state,
        userIsCreating: payload,
      };
    case UPDATE_USER:
      return state;
    case USER_IS_UPDATING:
      return {
        ...state,
        userIsUpdating: payload,
      };
    default:
      return state;
  }
};

export const setUsers = (payload) => ({type: SET_USERS, payload});
export const setSelectedUser = (payload) => ({
  type: SET_SELECTED_USER,
  payload,
});
export const usersAreLoading = (payload) => ({
  type: USERS_ARE_LOADING,
  payload,
});
export const userIsUpdating = (payload) => ({
  type: USER_IS_UPDATING,
  payload,
});
export const userIsDeleting = (payload) => ({type: USER_IS_DELETING, payload});
export const userIsCreating = (payload) => ({type: USER_IS_CREATING, payload});

// აქ და კიდე ბევრაგნ ქეჩში მგონი დისპაჩი აღარ უნდა
// დაკომენტარებულია სწორი ვარიანტი
export const getUsers = () => {
  return async (dispatch) => {
    dispatch(usersAreLoading(true));
    try {
      const {users: usersList} = await axiosInstance.get('users');
      dispatch(setUsers(usersList));
    } catch {
    } finally {
      dispatch(usersAreLoading(false));
    }
  };
};

export const deleteUser = (user) => {
  return async (dispatch) => {
    dispatch(userIsDeleting(true));
    try {
      await axiosInstance.delete(`users/${user.uid}`);
      dispatch({type: DELETE_USER, payload: user.uid});
      dispatch(showMessage('success', 'Success', 'user successfully deleteds'));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(userIsDeleting(false));
    }
  };
};

export const updateUser = (user, password) => {
  return async (dispatch) => {
    dispatch(userIsUpdating(true));
    try {
      await axiosInstance.patch(`users/${user.uid}`, {
        password,
      });
      dispatch({type: UPDATE_USER});
      dispatch(
        showMessage('success', 'Success', 'password successfully updated'),
      );
      goBack();
    } catch {
    } finally {
      dispatch(userIsUpdating(false));
    }
  };
};

export const createUser = (email, password, role) => {
  return async (dispatch) => {
    dispatch(userIsCreating(true));
    try {
      const user = {
        email,
        password,
        role: role,
        displayName: email.split('@')[0],
      };
      const response = await axiosInstance.post('register', user);
      user.uid = response.uid;
      delete user.password;
      dispatch({type: CREATE_USER, payload: user});
      dispatch(showMessage('success', 'Success', 'user successfully created'));
      goBack();
    } catch ({code}) {
      switch (code) {
        case 'auth/email-already-in-use':
          dispatch(showMessage('error', 'Error', 'Email already in use'));
          break;
        case 'auth/invalid-email':
          dispatch(
            showMessage('error', 'Error', 'That email address is invalid!'),
          );
          break;
        case 'auth/weak-password':
          dispatch(
            showMessage(
              'error',
              'Error',
              'Password must contain at least 6 symbols',
            ),
          );
          break;
      }
    } finally {
      dispatch(userIsCreating(false));
    }
  };
};

export default users;
