import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from "react-router-dom";

import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import GlobalStyle from 'jss-plugin-global';
import styles from './style';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import getLanguage from './languages';

function counter(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    default:
      return state
  }
}

const lang = getLanguage();
const store = createStore(counter);

const themeSettings = {
  palette: styles.lightMode,
  spacing: 8,
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  direction: 'ltr'
};

let jss = create({ plugins: [...jssPreset().plugins, GlobalStyle()] });

if (lang.direction === 'rtl') {
  document.body.setAttribute("dir", "rtl");
  themeSettings.direction = "rtl";
  jss = create({ plugins: [...jssPreset().plugins,  GlobalStyle(), rtl()] });
}

let theme = createMuiTheme(themeSettings);
theme = responsiveFontSizes(theme);

console.log(theme);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <StylesProvider jss={jss}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);