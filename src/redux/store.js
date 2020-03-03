import { configureStore, combineReducers, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
import { batch } from 'react-redux';
import Meeseeks from 'meeseeks-js';
import config from '../config';

const meeseeks = new Meeseeks(config);

const languageSlice = createSlice({
  name: 'language',
  initialState: {},
  reducers: {
    set(state, action) {
      return Object.assign(state, action.payload);
    },
  }
});

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    type: null,
    string: null,
  },
  reducers: {
    failure(state, action) {
      return Object.assign( state, { string: action.payload, type: "error"});
    },
    success(state, action) {
      state.type = "info";
      return Object.assign(state, { string: action.payload, type: "success"});
    },
    info(state, action) {
      state.type = "info";
      return Object.assign(state, { string: action.payload, type: "info"});
    },
    clear(state, action) {
      return Object.assign(state, { string: null, type: null});
    },
  }
})

const sessionSlice = createSlice({
  name: 'session',
  initialState: {},
  reducers: {
    setUser(state, action) {
      return state = Object.assign({}, state, action.payload);
    },
    clearUser(state, action) {
      return state = {};
    }
  }
});

const paramsSlice = createSlice({
  name: 'params',
  initialState: {},
  reducers: {
    set(state, action) {
      return state = Object.assign({}, state, action.payload);
    },
    clear(state, action) {
      return state = {};
    }
  }
});

function createUser(username, password, primary, secondary) {
  return function(dispatch, getState) {
    return meeseeks.createUser(username, password, primary, secondary).then(() => {
      return meeseeks.getUserData()
    }).then((result) => {
      let text = getState().language.createAccountSuccessText;
      batch(() => {
        dispatch(sessionSlice.actions.setUser(result));
        dispatch(messageSlice.actions.success(text));
      });
    })
  }
}

function checkSession() {
  return function(dispatch) {
    return meeseeks.hasActiveSession().then(() => {
      return meeseeks.getUserData();
    }).then((result) => {
      dispatch(sessionSlice.actions.setUser(result));
    }).catch((err) => {
      dispatch(messageSlice.actions.failure(err.message));
    });
  }
}

function logout() {
  return function(dispatch) {
    batch(() => {
      dispatch(sessionSlice.actions.clearUser());
      dispatch(messageSlice.actions.clear());
    })
    return meeseeks.logout();
  }
}

function login(username, password) {
  return function(dispatch) {
    return meeseeks.authenticate(username, password).then(() => {
      return meeseeks.getUserData();
    }).then((result) => {
      batch(() => {
        dispatch(sessionSlice.actions.setUser(result));
        dispatch(messageSlice.actions.clear());
      });
    }).catch((err) => {
      dispatch(messageSlice.actions.failure(err.message));
    });
  }
}

function sendPasswordReset(email) {
  return function(dispatch) {
    return meeseeks.sendPasswordResetEmail(email).then(() => {
      dispatch(messageSlice.actions.success("Sent password reset email"));
      return true;
    }).catch((err) => {
      dispatch(messageSlice.actions.failure(err.message));
      return false;
    });
  }
}

function submitPasswordReset(code, password) {
  return function(dispatch) {
    return meeseeks.submitPasswordReset(code, password).then(() => {
      dispatch(messageSlice.actions.success("Password updated"));
      return true;
    }).catch((err) => {
      dispatch(messageSlice.actions.failure(err.message));
      return false;
    });
  }
}

function verifyEmail(code) {
  return function(dispatch) {
    return meeseeks.verifyEmail(code).then(() => {
      dispatch(messageSlice.actions.success("Email address verified"));
    }).catch((err) => {
      dispatch(messageSlice.actions.failure(err.message));
    });
  }
}

export const actions = {
  session: sessionSlice.actions,
  language: languageSlice.actions,
  message: messageSlice.actions,
  params: paramsSlice.actions,
  meeseeks: {
    login: login,
    checkSession: checkSession,
    createUser: createUser,
    logout: logout,
    sendPasswordReset: sendPasswordReset,
    submitPasswordReset: submitPasswordReset,
    verifyEmail: verifyEmail,
  }
};

const rootReducer = combineReducers({
  session: sessionSlice.reducer,
  language: languageSlice.reducer,
  message: messageSlice.reducer,
  params: paramsSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
});