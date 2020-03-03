import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Switch } from "react-router-dom";

import { StylesProvider, ThemeProvider, jssPreset } from "@material-ui/styles";
import { createMuiTheme, createGenerateClassName, responsiveFontSizes } from '@material-ui/core/styles';
import { create } from 'jss';
import rtl from 'jss-rtl';
import GlobalStyle from 'jss-plugin-global';
import styles from './style';

import { Provider } from 'react-redux';
import { store, actions } from './redux/store';

import getLanguage from './languages';

console.log("actions", actions);
console.log("store", store);

const lang = getLanguage();
store.dispatch(actions.language.set(lang.strings));

const generateClassName = createGenerateClassName({
  productionPrefix: 'meeseeks',
});

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

console.log("theme", theme);
 
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <StylesProvider jss={jss} generateClassName={generateClassName}>
        <ThemeProvider theme={theme}>
          <Switch>
            <App />
          </Switch>
        </ThemeProvider>
      </StylesProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);