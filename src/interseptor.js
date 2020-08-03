import axios from 'axios';
import {backendURL} from './utils/api';
import AsyncStorage from '@react-native-community/async-storage';
import {notify} from './services/notificationService';
import {getCurrentRoute} from './services/navigationService';
import {resetStore, showMessage} from './store/ducks/main';
import storeRegistry from './store/storeRegistry';

//ყველგან სადაც აქსიოსს იყენებ backendURL ამიღე და აქ წესიერი იმპლემენტაცია გააკეთე
const axiosInstance = axios.create({
  baseURL: `${backendURL}`,
});

axiosInstance.interceptors.request.use(
  async (request) => {
    try {
      const data = await AsyncStorage.getItem('authorization');
      request.headers.common.Authorization = `Bearer ${data}`;
    } catch {}
    return request;
  },
  (error) => {
    return Promise.reject({...error});
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return onResponseFulfilled(response);
  },
  (error) => {
    return onResponseRejected(error);
  },
);

const onResponseFulfilled = (response) => {
  return response.data;
};

const onResponseRejected = (error) => {
  if (error.response.status !== 401) {
    storeRegistry
      .getStore()
      .dispatch(showMessage('error', 'Error', 'Something went wrong'));
  }
  if (
    error.response.status === 401 &&
    !getCurrentRoute().name.match('GetStarted|SignIn|SignUp') //მოძებნე იგზექთ მეჩი როგორ ქნა
  ) {
    try {
      AsyncStorage.removeItem('authorization');
      storeRegistry.getStore().dispatch(resetStore());
    } catch {
      notify('error', 'Error', 'Something went wrong');
    }
  }
  return Promise.reject({...error});
};
export default axiosInstance;
