import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {main, auth, trips, users} from './ducks';
import {RESET_STORE} from './ducks/main';

const appReducer = combineReducers({
  main,
  auth,
  trips,
  users,
});

const rootReducer = (state, action) => {
  if (action.type === RESET_STORE) {
    state = {auth: {user: null, isLoading: false}};
  }
  return appReducer(state, action);
};

//preloadedState ამ პარამეტრზე გაარკვიე
export default function configureStore(preloadedState) {
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const composedEnhancers = composeEnhancers(...enhancers);

  const store = createStore(rootReducer, preloadedState, composedEnhancers);

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./ducks', () => store.replaceReducer(rootReducer));
  }
  return store;
}

//იქნებ ასე ჯობია
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// export default function configureStore() {
//   const store = createStore(
//     rootReducer,
//     composeEnhancers(applyMiddleware(thunk)),
//   );
//   return store;
// }
