import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Redirect } from 'react-router-dom';
import Meeseeks from 'meeseeks';

import Field from './Field';
import Button from './Button';
import ErrorMsg from './ErrorMsg';
import Loader from './Loader';

class PasswordEntry extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    code: PropTypes.string,
    user: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      confirm: "",
      error: null,
      loader: false,
      success: false,
    }

    this.controls = {
      password: injectSheet(this.props.classes)(Field),
      submit: injectSheet(this.props.classes)(Button),
      error: injectSheet(this.props.classes)(ErrorMsg),
      loader: injectSheet(this.props.classes)(Loader)
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    let state = {};
    state[evt.target.id] = evt.target.value;
    this.setState(state);
  }

  validatePassword() {
    if (this.state.password !== this.state.confirm) {
      let e = "Password values do not match.";
      return e;
    }

    if (this.state.password.length < 8) {
      let e = "Passwords need to be at least 8 characters long.";
      return e;
    }

    let sc = !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?\d]/g.test(this.state.password);

    if (sc) {
      let e = "Passwords must contain at least one number or special character.";
      return e;
    }

    return null;
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.setState({loader: true});

    let err = this.validatePassword();
    if (err) {
      let error = (
          <ErrorMsg>{err}</ErrorMsg>
        );
      return this.setState({error: error, loader: false});
    }

    let self = this;
    Meeseeks.submitPasswordReset(this.props.code, this.state.password).then(function(result) {

      self.setState({loader: false, success: true});

    }).catch(function(error) {
      let err = (
        <ErrorMsg>{error}</ErrorMsg>
        );
      self.setState({error: err, loader: false});
    })
  }

  loader() {
    const Spinner = this.controls.loader;
    return(
      <div className={this.props.className}>
        <Spinner />
      </div>
    )
  }

  render() {
    const Password = this.controls.password;
    const Submit = this.controls.submit;

    if (this.state.success) {
      return (<Redirect to="/" />);
    }

    if (this.state.loader) {
      return this.loader();
    }

    return (
      <div className={this.props.className}>
        <section id="error">{this.state.error}</section>
        <div>Enter your new password. Passwords must be a minimum of 8 characters long, with at least one number or special character.</div>
        <section id="newPasswordForm">
          <form id="form" onSubmit={this.handleSubmit}>
            <div>
              <Password required={true} type="password" id="password" label="New Password" value={this.state.password} onChange={this.handleChange} />
            </div>
            <div>
              <Password required={true} type="password" id="confirm" label="Confirm Password" value={this.state.confirm} onChange={this.handleChange} />
            </div>
            <Submit type="submit">Update</Submit>
          </form>
        </section>
      </div>
    );
  }
}

export default PasswordEntry