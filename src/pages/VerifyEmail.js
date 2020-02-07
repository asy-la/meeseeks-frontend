import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import queryString from 'query-string';

import Meeseeks from '../utils/Meeseeks';
import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';

class VerifyEmail extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loader: true,
      verified: false
    }

    this.controls = {
      loader: injectSheet(this.props.classes)(Loader)
    }

    let values = queryString.parse(props.location.location.search);
    let self = this;

    if (!values.code) {
      this.setState({error: "invalid code"});
    }

    Meeseeks.verifyEmail(values.code).then(function(result) {
      self.setState({loader: false, verified: true})
    }).catch(function(err) {
      let e = (
        <ErrorMsg>{err}</ErrorMsg>
        );
      self.setState({error: e, loader: false});
    })
  }

  complete() {
    return(
      <div className={this.props.className}>
        <div>Thank you! Your email address has been verified.</div>
      </div>
    );
  }

  error() {
    return(
      <div className={this.props.className}>
        {this.state.error}
      </div>
    );
  }

  loader() {
    const Spinner = this.controls.loader;

    return(
      <div className={this.props.className}>
        <Spinner />
      </div>
    );
  }

  render() {

    if (this.state.loader) return this.loader();

    if (this.state.verified) return this.complete();

    if (this.state.error) return this.error();
  }
}

export default VerifyEmail;