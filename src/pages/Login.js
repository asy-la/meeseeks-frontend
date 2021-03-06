import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';

import Form from '../components/Login';

function Login(props) {

  let values = queryString.parse(props.location.location.search);
  let redirectURI = null;

  if (values.redirectURI) {
    redirectURI = values.redirectURI;
    sessionStorage.setItem("redirectURI", values.redirectURI)
    return (
      <Redirect to="/" />
    );
  } else {
    let existing = sessionStorage.getItem("redirectURI");
    if (existing && existing !== "") {
      redirectURI = existing;
    }
  }

  if (values.token || values.refresh) {
    Cookies.set("access_token", values.token);
    Cookies.set("refresh_token", values.refresh);

    if (!redirectURI) {
      redirectURI = "/";
    }
    
    sessionStorage.removeItem("redirectURI");
    window.location.assign(redirectURI);
  }

  if (redirectURI != null) {
    return (
      <Form classes={props.jss} className={props.jss.classes.loginform} redirect={redirectURI}/>
    );
  }

  return (
    <Form classes={props.jss} className={props.jss.classes.loginform} />
  );
}

Login.propTypes = {
  jss: PropTypes.object.isRequired
}

export default Login;
