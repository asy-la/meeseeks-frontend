import en from './en';
import sp from './sp';
import fr from './fr';
import ru from './ru';
import jp from './jp'
import ar from './ar';

function getLanguage() {
  let lang = navigator.language;

  //return {strings: ar, direction: "rtl"};

  if (lang.search(/^en/im) > -1) {
    return {strings: en, direction: "ltr"};
  }

  if (lang.search(/^es/im) > -1) {
    return {strings: sp, direction: "ltr"};
  }

  if (lang.search(/^fr/im) > -1) {
    return {strings: fr, direction: "ltr"};
  }

  if (lang.search(/^ru/im) > -1) {
    return {strings: ru, direction: "ltr"};
  }

  if (lang.search(/^jp/im) > -1) {
    return {strings: jp, direction: "ltr"};
  }

  if (lang.search(/^ar/im) > -1) {
    return {strings: ar, direction: "rtl"};
  }

  return {strings: en, direction: "ltr"};
}

export default getLanguage;