import React from 'react';
import { Redirect } from "react-router-dom";
import queryString from 'query-string';

import { store, actions } from '../redux/store';

export default function ParamParser(props) {
  let content = props.children;
  let params = queryString.parse(props.location.search);

  if (params && Object.keys(params).length > 0) {
    if (params.error) {
      store.dispatch(actions.message.failure(params.error))
    }

    if (params.info) {
      store.dispatch(actions.message.info(params.info));
    }

    if (params.code) {
      store.dispatch(actions.params.set({code: params.code}));
    }

    if (params.redirectURI) {
      store.dispatch(actions.params.set({redirectURI: params.redirectURI}));
    }

    content = (
      <Redirect to={{pathname: props.location.pathname, search: ""}} />
    )
  }

  return content;
}