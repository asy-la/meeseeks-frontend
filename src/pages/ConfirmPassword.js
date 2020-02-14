import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import queryString from 'query-string';

import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';

class ConfirmPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loader: false
    }
  }
}

export default ConfirmPassword;