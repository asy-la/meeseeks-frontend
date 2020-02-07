import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Meeseeks from '../utils/Meeseeks';

import Field from './Field';
import Button from './Button';
import ErrorMsg from './ErrorMsg';
import Loader from './Loader';

class ResetPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: null,
      loader: false,
      error: null,
      success: false
    }

    this.controls = {
      email: injectSheet(this.props.classes)(Field),
      submit: injectSheet(this.props.classes)(Button),
      loader: injectSheet(this.props.classes)(Loader)
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(evt) {
    this.setState({value: evt.target.value})
  }

  handleSubmit(evt) {
    evt.preventDefault();
    let self = this;

    this.setState({loader: true});

    Meeseeks.sendPasswordResetEmail(this.state.value).then(function(result) {
      self.setState({loader:false, success: true});
    }).catch(function(err) {
      let e = (
        <ErrorMsg>{err}</ErrorMsg>
      );
      self.setState({error: e, loader:false});
    })
  }

  loader() {
    const Loader = this.controls.loader;
    return (
      <div className={this.props.className}>
        <Loader classes={[this.props.classes.loader]}/>
      </div>
    );
  }

  render() {
    const Submit = this.controls.submit;
    const Email = this.controls.email;

    if (this.state.loader) {
      return this.loader();
    }

    if (this.state.success === true) {
      let msg = `Please check your ${this.state.value} inbox for a link to reset your password.`
      return (
        <div className={this.props.className}>
          <span>{msg}</span>
        </div>
      );
    }

    return (
      <div className={this.props.className}>
        <section id="error">{this.state.error}</section>
        <div>Enter your email address to receive a link to reset your password.</div>
        <section id="passwordReset">
          <form id="form" onSubmit={this.handleSubmit}>
            <div>
              <Email type="email" id="email" label="Email" required={true} onChange={this.handleChange}/>
            </div>
            <Submit type="submit">Send</Submit>
          </form>
        </section>
      </div>
    )
  }
}

ResetPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ResetPassword;