import { configureStore, combineReducers, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit'
import ReduxThunk from 'redux-thunk'; 

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    user:{},
    error: null,
  },
  reducers: {
    loginSuccess(state, action) {
      state.error = action.payload.message;
    },
    loginFailure(state, action) {
      return Object.assign({}, state.user, action.payload);
    }
  }
});

const rootReducer = combineReducers({
  session: sessionSlice.reducer,
});

export const actions = {
  session: Object.assign({}, sessionSlice.actions),
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: [ReduxThunk, ...getDefaultMiddleware()],
});