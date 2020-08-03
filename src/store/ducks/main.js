export const RESET_STORE = 'toptal/main/resetStore';
const SHOW_MESSAGE = 'toptal/main/showMessage';
const ERROR = 'toptal/main/error';
import {notify} from '../../services/notificationService';

const initialState = {};

const main = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case ERROR:
      return state;
    case SHOW_MESSAGE:
      const {status, title, message} = payload; // უფრო ლამაზად ხო არ იწერება
      notify(status, title, message);
      return state;
    default:
      return state;
  }
};

export const resetStore = () => ({
  type: RESET_STORE,
});

export const showMessage = (status, title, message) => ({
  type: SHOW_MESSAGE,
  payload: {status, title, message},
});

export const error = () => ({
  type: ERROR,
});

export default main;
