const color = {
  asylaBlue: "#4BA9E0",
  asylaDark: "#17191a",
  dark: "#292929",
  light: "#c7c7c7",
};

const darkMode = {
  type: 'dark',
  primary: {
    main: color.light,
    light: color.asylaBlue,
    dark: color.asylaDark,
  },
  secondary: {
    main: color.asylaDark,
    light: color.dark,
    dark: color.dark,
  },
  background: {
    default: color.asylaDark,
  },
};

const lightMode = {
  type: 'light',
  primary: {
    main: color.asylaBlue,
    light: color.asylaBlue,
    dark: color.asylaDark,
  },
  secondary: {
    main: color.asylaDark,
    light: color.asylaBlue,
    dark: color.dark,
  },
  background: {
    default: color.asylaBlue,
  },
};

export default {
  lightMode: lightMode,
  darkMode: darkMode
};