const SET_TRIPS = 'toptal/trip/setTrips';
const MERGE_TRIPS = 'toptal/trip/mergeTrips';
const SET_TRIPS_FILTER_DATA = 'toptal/trip/setTripsFilterData';
const NEXT_MONTH_IS_CHECKED = 'toptal/trip/nextMonthIsChecked';
const TRIP_DETAILS_ARE_LOADING = 'toptal/trip/tripDetailsAreLoading';
const TRIP_DETAILS_FOR_NEXT_MONTH_ARE_LOADING =
  'toptal/trip/tripDetailsforNextMonthAreLoading';
const CREATE_TRIP = 'toptal/trip/createTrip';
const UPDATE_TRIP = 'toptal/trip/updateTrip';
const DELETE_TRIP = 'toptal/trip/deleteTrip';
const TRIP_IS_CREATING = 'toptal/trip/tripIsCreating';
const TRIP_IS_UPDATING = 'toptal/trip/tripIsUpating';
const TRIP_IS_DELETING = 'toptal/trip/tripIsDeleting';
const SET_SELECTED_TRIP = 'toptal/trip/setSelectedTrip';
const SET_CURRENT_DATE = 'toptal/trip/setCurrentDate';
const CURRENT_DATE_IS_LOADING = 'toptal/trip/currentDateIsLoading';
import axiosInstance from '../../interceptor';
import {backendURL} from '../../utils/api';
import {showMessage} from './main';
import {navigate, goBack} from '../../services/navigationService';
import {getDaysBetween, getDateAfterMonth} from '../../utils/date';
import {AppState} from 'react-native';

//იფიქრე იქნებ რედაქსიდან showMessage საერთოდ ამოიღო და ინტერსეფტორში გქონდეს ერრორ ჰენდლინგი
const initialState = {
  tripDetailsAreLoading: false,
  tripDetailsForNextMonthAreLoading: false,
  tripIsCreating: false,
  tripIsUpating: false,
  tripIsDeleting: false,
  tripsFilter: {},
  trips: {},
  selectedTrip: null,
  currentDate: null,
  currentDateIsLoading: false,
  nextMonthIsChecked: false,
};

const trips = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case SET_TRIPS:
      if (payload.length === 0) {
        return {
          ...state,
          trips: {},
        };
      }
      const tripsToSet = {};
      payload.forEach((el) => {
        const [startDate, endDate] = [
          new Date(el.startDate),
          new Date(el.endDate),
        ];
        tripsToSet[el.id] = {
          ...el,
          startDate,
          endDate,
          daysLeft: getDaysBetween(state.currentDate, startDate),
        };
      });
      return {
        ...state,
        trips: tripsToSet,
      };
    case MERGE_TRIPS:
      if (payload.length === 0) {
        return state;
      }
      const tripsToMerge = {};
      payload.forEach((el) => {
        const [startDate, endDate] = [
          new Date(el.startDate),
          new Date(el.endDate),
        ];
        tripsToMerge[el.id] = {
          ...el,
          startDate,
          endDate,
          daysLeft: getDaysBetween(state.currentDate, startDate),
        };
      });
      return {
        ...state,
        trips: {...state.trips, ...tripsToMerge},
      };
    case CREATE_TRIP:
      if (
        state.nextMonthIsChecked &&
        payload.startDate > getDateAfterMonth(payload.startDate)
      ) {
        return state;
      }
      if (
        !state.nextMonthIsChecked &&
        !!state.tripsFilter.startDate &&
        new Date(payload.startDate) < state.tripsFilter.startDate
      ) {
        return state;
      }
      if (
        !state.nextMonthIsChecked &&
        !!state.tripsFilter.endDate &&
        new Date(payload.endDate) > state.tripsFilter.startDate
      ) {
        return state;
      }
      return {
        ...state,
        trips: {
          ...state.trips,
          ...{
            [payload.id]: {
              ...payload,
              daysLeft: getDaysBetween(state.currentDate, payload.startDate),
              startDate: new Date(payload.startDate),
              endDate: new Date(payload.endDate),
            },
          },
        },
      };
    case UPDATE_TRIP:
      const tripsCopy = {...state.trips};
      delete tripsCopy[payload.id];
      if (
        state.nextMonthIsChecked &&
        payload.startDate > getDateAfterMonth(payload.startDate)
      ) {
        return {
          ...state,
          trips: tripsCopy,
        };
      }
      if (
        !state.nextMonthIsChecked &&
        !!state.tripsFilter.startDate &&
        new Date(payload.startDate) < state.tripsFilter.startDate
      ) {
        return {
          ...state,
          trips: tripsCopy,
        };
      }
      if (
        !state.nextMonthIsChecked &&
        !!state.tripsFilter.endDate &&
        new Date(payload.endDate) > state.tripsFilter.startDate
      ) {
        return {
          ...state,
          trips: tripsCopy,
        };
      }
      return {
        ...state,
        trips: {
          ...state.trips,
          ...{
            [payload.id]: {
              ...payload,
              daysLeft: getDaysBetween(state.currentDate, payload.startDate),
              startDate: new Date(payload.startDate),
              endDate: new Date(payload.endDate),
            },
          },
        },
      };
    case NEXT_MONTH_IS_CHECKED:
      return {
        ...state,
        nextMonthIsChecked: payload,
      };
    case DELETE_TRIP:
      const temp = {...state.trips};
      temp.hasOwnProperty(payload) && delete temp[payload];
      return {
        ...state,
        trips: temp,
      };
    case SET_TRIPS_FILTER_DATA:
      return {
        ...state,
        tripsFilter: payload,
      };
    case TRIP_DETAILS_ARE_LOADING:
      return {
        ...state,
        tripDetailsAreLoading: payload,
      };
    case TRIP_DETAILS_FOR_NEXT_MONTH_ARE_LOADING:
      return {
        ...state,
        tripDetailsforNextMonthAreLoading: payload,
      };
    case TRIP_IS_CREATING:
      return {
        ...state,
        tripIsCreating: payload,
      };
    case TRIP_IS_UPDATING:
      return {
        ...state,
        tripIsUpating: payload,
      };
    case TRIP_IS_DELETING:
      return {
        ...state,
        tripIsDeleting: payload,
      };
    case SET_SELECTED_TRIP:
      if (payload === null) {
        return {...state, selectedTrip: null};
      }
      return {
        ...state,
        selectedTrip: {
          ...state,
          ...payload,
          daysLeft: getDaysBetween(state.currentDate, payload.startDate),
        },
      };
    case SET_CURRENT_DATE:
      return {
        ...state,
        currentDate: payload,
      };
    case CURRENT_DATE_IS_LOADING:
      return {
        ...state,
        currentDateIsLoading: payload,
      };
    default:
      return state;
  }
};

export const setTrips = (payload) => ({type: SET_TRIPS, payload});
export const mergeTrips = (payload) => ({type: MERGE_TRIPS, payload});
export const toggleNextMonthCheckBox = (payload) => ({
  type: NEXT_MONTH_IS_CHECKED,
  payload,
});
export const tripDetailsAreLoading = (payload) => ({
  type: TRIP_DETAILS_ARE_LOADING,
  payload,
});
export const tripDetailsforNextMonthAreLoading = (payload) => ({
  type: TRIP_DETAILS_FOR_NEXT_MONTH_ARE_LOADING,
  payload,
});
export const setSelectedTrip = (payload) => ({
  type: SET_SELECTED_TRIP,
  payload,
});
export const currentDateIsLoading = (payload) => ({
  type: CURRENT_DATE_IS_LOADING,
  payload,
});
export const setTripsFilterData = (payload) => ({
  type: SET_TRIPS_FILTER_DATA,
  payload,
});
export const tripIsCreating = (payload) => ({type: TRIP_IS_CREATING, payload});
export const tripIsUpating = (payload) => ({type: TRIP_IS_UPDATING, payload});
export const tripIsDeleting = (payload) => ({type: TRIP_IS_DELETING, payload});
export const setCurrentDate = (payload) => ({type: SET_CURRENT_DATE, payload});

export const getCurrentDate = () => {
  return async (dispatch) => {
    dispatch(currentDateIsLoading(true));
    try {
      const {date} = await axiosInstance.get('date');
      dispatch(setCurrentDate(new Date(date)));
      setTimeout(() => {
        dispatch(setCurrentDate(new Date(date)));
      }, 2000);
    } catch {
    } finally {
      dispatch(currentDateIsLoading(false));
    }
  };
};

export const getTrips = (filterData, merge = false, offset = 0, limit = 20) => {
  return async (dispatch) => {
    dispatch(tripDetailsAreLoading(true));
    try {
      const {date} = await axiosInstance.get('date');
      dispatch(setCurrentDate(new Date(date)));
      let params = {offset, limit};
      if (filterData) {
        params = {...params, ...filterData};
      }
      const tripsData = await axiosInstance.get('trips', {params});
      dispatch(merge ? mergeTrips(tripsData) : setTrips(tripsData));
    } catch {
    } finally {
      dispatch(tripDetailsAreLoading(false));
    }
  };
};

export const getNextMonthTrips = (merge = false, offset = 0, limit = 20) => {
  return async (dispatch) => {
    dispatch(tripDetailsforNextMonthAreLoading(true));
    try {
      const {date} = await axiosInstance.get('date');
      dispatch(setCurrentDate(new Date(date)));
      const tripsData = await axiosInstance.get('trips/next', {
        params: {offset, limit},
      });
      dispatch(merge ? mergeTrips(tripsData) : setTrips(tripsData));
    } catch {
    } finally {
      dispatch(tripDetailsforNextMonthAreLoading(false));
    }
  };
};

export const createTrip = (tripData) => {
  return async (dispatch) => {
    dispatch(tripIsCreating(true));
    try {
      const {date} = await axiosInstance.get('date');
      dispatch(setCurrentDate(new Date(date)));
      const createdTrip = await axiosInstance.post('trips', tripData);
      dispatch({type: CREATE_TRIP, payload: createdTrip});
      navigate('Trips');
      dispatch(
        showMessage('success', 'Success', 'The trip cuccessfully created'),
      );
    } catch {
    } finally {
      dispatch(tripIsCreating(false));
    }
  };
};

export const updateTrip = (id, tripData) => {
  return async (dispatch) => {
    dispatch(tripIsUpating(true));
    try {
      const {date} = await axiosInstance.get('date');
      dispatch(setCurrentDate(new Date(date)));
      await axiosInstance.put(`trips/${id}`, tripData);
      dispatch(setSelectedTrip({id, ...tripData}));
      dispatch({type: UPDATE_TRIP, payload: {...tripData, id}});
      goBack();
      dispatch(
        showMessage('success', 'Success', 'The trip cuccessfully updated'),
      );
    } catch {
    } finally {
      dispatch(tripIsUpating(false));
    }
  };
};

export const deleteTrip = (id) => {
  return async (dispatch) => {
    dispatch(tripIsDeleting(true));
    try {
      await axiosInstance.delete(`trips/${id}`);
      dispatch(
        showMessage('success', 'Success', 'The trip cuccessfully deleted'),
      );
      navigate('Trips');
      dispatch({type: DELETE_TRIP, payload: id});
    } catch {
    } finally {
      dispatch(tripIsDeleting(false));
    }
  };
};

export default trips;
