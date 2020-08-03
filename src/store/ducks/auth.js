const SET_USER = 'toptal/auth/setUser';
const SET_IS_LOADING = 'toptal/ayth/setIsLoading';
const AUTH_IN_PROGRESS = 'toptal/auth/authInProgress';
const PROFILE_UPDATE_IN_PROGRESS = 'toptal/auth/profileUpdateInProgress';
import {showMessage, error, resetStore} from './main';
import {backendURL} from '../../utils/api';
import Axios from 'axios';
import axiosInstance from '../../interseptor';
import AsyncStorage from '@react-native-community/async-storage';
import fbAuth from '@react-native-firebase/auth';
import {goBack} from '../../services/navigationService';
import users from './users';

const initialState = {
  user: null,
  isLoading: true,
  authIsInProgress: false,
  profileUpdateInProgress: false,
};

const auth = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case SET_USER:
      return {
        ...state,
        user: payload,
      };
    case SET_IS_LOADING:
      return {
        ...state,
        isLoading: payload,
      };
    case AUTH_IN_PROGRESS:
      return {
        ...state,
        authIsInProgress: payload,
      };
    case PROFILE_UPDATE_IN_PROGRESS:
      return {
        ...state,
        profileUpdateInProgress: payload,
      };
    default:
      return state;
  }
};

const setUser = (payload) => ({
  type: SET_USER,
  payload,
});

const setIsLoading = (isLoading) => ({
  type: SET_IS_LOADING,
  payload: isLoading,
});

const authInProgress = (payload) => ({
  type: AUTH_IN_PROGRESS,
  payload,
});

const profileUpdateInProgress = (payload) => ({
  type: PROFILE_UPDATE_IN_PROGRESS,
  payload,
});

export const signOut = () => {
  return async (dispatch) => {
    try {
      AsyncStorage.removeItem('authorization');
      dispatch(resetStore());
    } catch {
      dispatch(showMessage('error', 'Error', 'something went wrong'));
    }
  };
};

export const ping = () => {
  return async (dispatch) => {
    try {
      const user = await axiosInstance.get('ping');
      dispatch(setUser(user));
    } catch {
    } finally {
      dispatch(setIsLoading(false));
    }
  };
};

export const editProfile = (user, password) => {
  return async (dispatch) => {
    try {
      dispatch(profileUpdateInProgress(true));
      await axiosInstance.patch(`users/${user.uid}`, {
        uid: user.uid,
        password,
      });
      dispatch(
        showMessage('success', 'Success', 'password successfully updated'),
      );
    } catch {
    } finally {
      dispatch(profileUpdateInProgress(false));
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    dispatch(authInProgress(true));
    try {
      await fbAuth().signInWithEmailAndPassword(email, password);
      try {
        const {token, claims} = await fbAuth().currentUser.getIdTokenResult();
        await AsyncStorage.setItem('authorization', `${token}`);
        const user = {
          uid: claims.user_id,
          name: claims.name,
          email: claims.email,
          role: claims.role,
        };
        dispatch(setUser(user));
      } catch {
        dispatch(showMessage('error', 'Error', 'Something went wrong'));
      }
    } catch ({code}) {
      switch (code) {
        case 'auth/user-not-found':
          dispatch(showMessage('error', 'Error', 'User not found'));
          break;
        case 'auth/wrong-password':
          dispatch(showMessage('error', 'Error', 'Wrong password'));
          break;
        case 'auth/too-many-requests':
          dispatch(showMessage('error', 'Error', 'Please try again later'));
          break;
        case 'auth/invalid-email':
          dispatch(
            showMessage('error', 'Error', 'That email address is invalid!'),
          );
          break;
      }
    } finally {
      dispatch(authInProgress(false));
    }
  };
};

//createUser ჯობია ცალკე იყოს რიმელიც პარამეტრად მიიღებს როლს
export const signUp = (email, password) => {
  return async (dispatch) => {
    dispatch(authInProgress(true));
    try {
      const response = await Axios.post('register', {
        email,
        password,
        role: 'ordinary',
        displayName: email.split('@')[0],
      });
      await AsyncStorage.setItem(
        'authorization',
        `${response.data.authorization}`,
      );
      dispatch(
        showMessage('success', 'Success', 'account successfully created'),
      );
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
      dispatch(authInProgress(false));
    }
  };
};

export default auth;
