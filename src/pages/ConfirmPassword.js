import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import queryString from 'query-string';
import Meeseeks from 'meeseeks-js';

import Loader from '../components/Loader';
import ErrorMsg from '../components/ErrorMsg';
import Field from '../components/Field';
import Button from '../components/Button';
import Link from '../components/Link';

class ConfirmPassword extends React.Component {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      infoMsg: null,
      loader: false,
      password: "",
      code: null,
      redirectURI: null,
      linkText: "Cancel",
    }

    this.controls = {
      password: injectSheet(this.props.classes.rules.raw)(Field),
      submit: injectSheet(this.props.classes.rules.raw)(Button),
      error: injectSheet(this.props.classes)(ErrorMsg),
      loader: injectSheet(this.props.classes)(Loader),
      link: injectSheet(this.props.classes.rules.raw)(Link)
    }

    let values = queryString.parse(props.location.location.search);
    console.log(values);

    if (values.msg) {
      this.state.infoMsg = values.msg;
    }

    if (values.redirectURI) {
      this.state.redirectURI = values.redirectURI;
    }

    if (values.code) {
      this.state.code = values.code;
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loader: true});

    let self = this;
    Meeseeks.updateUserData(this.state.code, this.state.password).then(function(result) {
      window.location.assign(self.state.redirectURI);
      return;
    }).catch(function(error) {
      let err = (
        <ErrorMsg>{error}</ErrorMsg>
        );
      self.setState({error: err, loader: false});
    });
  }

  handleChange(event) {
    this.setState({password: event.target.value});
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
    let Password = this.controls.password;
    let Submit = this.controls.submit;
    let Cancel = this.controls.link;

    return (
      <div className={this.props.className}>
        <section id="error">{this.state.error}</section>
        <section>
          <div>
            {this.state.infoMsg}
          </div>
        </section>
        <section id="PasswordForm">
          <form id="form" onSubmit={this.handleSubmit}>
            <div>
              <Password required={true} type="password" id="password" label="Password" value={this.state.password} onChange={this.handleChange} />
            </div>
            <Submit className="button" type="submit">Update</Submit>
          </form>
        </section>
        <section id="links">
          <div>
            <Cancel href={this.state.redirectURI} ext={true} style={{float:'left'}}>{this.state.linkText}</Cancel>
          </div>
        </section>
      </div>
    );
  }
}

export default ConfirmPassword;