import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import Meeseeks from 'meeseeks-js';

import Link from './Link';
import Button from './Button';
import Field from './Field';
import ErrorMsg from './ErrorMsg';
import Loader from './Loader';
import { ReactComponent as GHLogo } from '../icons/ghlogo.svg';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "", 
      password: "",
      loader: true,
      error: null,
      user: null
    };

    this.controls = {

      button: injectSheet(this.props.classes.rules.raw)(Button),
      field: injectSheet(this.props.classes.rules.raw)(Field),
      loader: injectSheet(this.props.classes.rules.raw)(Loader),
      link: injectSheet(this.props.classes.rules.raw)(Link),
      ghlogin: injectSheet(this.props.classes.rules.raw)(Button),
    };

    let savedUsername = sessionStorage.getItem("username");
    if (savedUsername && savedUsername !== "") this.state.username = savedUsername;

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInvalid = this.handleInvalid.bind(this);
    this.github = this.github.bind(this);
  }

  componentDidMount() {
    this.setState({loader: true});

    var self = this;

    Meeseeks.getUserData().then(function(result) {
      return self.setState({user: result, error: null, loader: false});
    })
    .catch(function(error) {
      let err = (
        <ErrorMsg>{error}</ErrorMsg>
        );
      self.setState({error: err, loader: false, user: null});
    });
  }

  handleFieldChange(event) {
    event.target.setCustomValidity('');

    let newState = {};
    newState[event.target.id] = event.target.value
    this.setState(newState);

    if (event.target.id === "username") {
      sessionStorage.setItem("username", event.target.value);
    }
  };

  handleInvalid(event) {

    if (event.target.id === "password") {
      event.target.setCustomValidity("Please enter your password.");
    }

    if (event.target.id === "username") {
      event.target.setCustomValidity("Please enter your email address.")
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({loader: true});

    let self = this;
    Meeseeks.authenticate(this.state.username, this.state.password)
      .then(function(result) {
        return Meeseeks.getUserData()
      })
      .then(function(result) {
        return self.setState({user: result, error: null, loader: false});
      })
      .catch(function(error) {
        let err = (
          <ErrorMsg>{error}</ErrorMsg>
          );

        return self.setState({error: err, loader: false, user: null});
      });
  }

  loader() {
    const Loader = this.controls.loader;
    return (
      <div className={this.props.className}>
        <Loader classes={[this.props.classes.loader]}/>
      </div>
    );
  }

  logout() {
    Meeseeks.logout();
    this.setState({user: null})
  }

  login() {
    let errMsg = null;
    const LoginField = this.controls.field;
    const LoginButton = this.controls.button;
    const LoginLink = this.controls.link;
    let GHLogin = this.controls.ghlogin;

    if (this.state.loader) {
      return this.loader();
    }

    if (this.state.error) {
      errMsg = this.state.error;
    }

    console.log(this.props);

    return(
      <div className={this.props.className}>
        <section id="error">{errMsg}</section>
        <section id="form">
          <form onSubmit={this.handleSubmit} onInvalid={this.handleInvalid}>
            <div>
              <LoginField
                required={true}
                id="username" 
                label="Username or Email" 
                type="text" 
                onChange={this.handleFieldChange} 
                value={this.state.username} />
            </div>
            <div>
              <LoginField
                required={true}
                id="password"
                label="Password"
                type="password"
                onChange={this.handleFieldChange}
                value={this.state.password} />
            </div>
            <LoginButton className="button" type="submit">Log in</LoginButton>
          </form>
        </section>
        <section id="federated" style={{textAlign:"center"}}>
          <hr></hr>
          <GHLogin onClick={this.github} className="github" /*className={this.props.classes.classes.github}*/>
            <GHLogo></GHLogo>
            <span style={{marginLeft:'5px'}}>GitHub</span>
          </GHLogin>
        </section>
        <section id="links">
          <div>
            <LoginLink href="/reset" style={{float:'left'}}>Forgot your password?</LoginLink>
            <LoginLink href="/create" style={{float:'right'}}>Don't have an account?</LoginLink>
          </div>
        </section>
      </div>
    );
  }

  success() {
    let self = this;
    const LoginButton = this.controls.button;
    const LoginLink = this.controls.link;

    if (this.props.redirect) {
      sessionStorage.removeItem("redirectURI");
      return window.location.assign(this.props.redirect);
    }

    return(
      <div className={this.props.className}>
        <section id="content">
          <div>
            <h1>You are logged on as {this.state.user.username}.</h1>
            <LoginButton className="button" onClick={function(){self.logout();}}>Logout</LoginButton>
          </div>
        </section>
        <section id="links">
          <div>
            <LoginLink href="/reset" style={{float:'left'}}>Change your password</LoginLink>
          </div>
        </section>
      </div>
    );
  }

  github() {
    window.location.assign("http://localhost:8000/login/github/?redirect_uri=http%3A%2F%2Flocalhost:3000%2F");
    return;
  }

  render() {

    if (this.state.loader) return this.loader();

    if (!this.state.user) {
      return this.login();
    } else {
      return this.success();
    }
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Login;