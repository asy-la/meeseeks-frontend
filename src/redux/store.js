import { configureStore, combineReducers, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
import Meeseeks from 'meeseeks-js';
import config from '../config';

const meeseeks = new Meeseeks(config);

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    user:{},
    error: null,
  },
  reducers: {
    setUser(state, action) {
      state.error = null;
      state.user = Object.assign({}, state.user, action.payload);
    },
    failure(state, action) {
      state.error = action.payload;
    },
  }
});

function checkSession() {
  return function(dispatch) {
    return meeseeks.hasActiveSession().then(() => {
      return meeseeks.getUserData();
    }).then((result) => {
      dispatch(sessionSlice.actions.setUser(result));
    }).catch((err) => {
      dispatch(sessionSlice.actions.failure(err.message));
    });
  }
}

function login(username, password) {
  return function(dispatch) {
    return meeseeks.authenticate(username, password).then(() => {
      return meeseeks.getUserData();
    }).then((result) => {
      dispatch(sessionSlice.actions.setUser(result));
    }).catch((err) => {
      dispatch(sessionSlice.actions.failure(err.message));
    });
  }
}

export const actions = {
  session: Object.assign({}, sessionSlice.actions),
  login: login,
  checkSession: checkSession,
};

const rootReducer = combineReducers({
  session: sessionSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
});