import React, { useState, useEffect } from 'react';
import { Redirect, NavLink } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Link from '@material-ui/core/Link';
import LinearProgress from '@material-ui/core/LinearProgress';

import { store, actions } from '../redux/store';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const getUserSelector = createSelector([state => state.session], (user) => {
  return user;
});

export default function CreateAccount(props) {

  const lang = useSelector(state => state.language)
  const user = useSelector(state => getUserSelector(state))
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loader, setLoader] = useState(false);
  const [buttondisabled, setButtondisabled] = useState(true);
  const [fielddisabled, setFielddisabled] = useState(false);
  const [active, setActive] = useState(false);
  const passwordRe = /[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?\d]/g;

  let loaderContent;
  if (loader) {
    loaderContent = (
      <LinearProgress />
    );
  }

  useEffect(() => {
    if (username !== "" && email !== "" && password !== "" && confirm !== "") {
      setButtondisabled(false);
    }
  }, [username, email, password, confirm])

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setActive(true);
    }
  }, [user]);

  function handleSubmit(e) {
    e.preventDefault();

    let match = password.match(passwordRe);

    if (!match) {
      return store.dispatch(actions.message.failure("Password doesn't meet minimum requirements"))
    }

    if (password !== confirm) {
      return store.dispatch(actions.message.failure("Password values don't match"))
    }

    setLoader(true);
    setButtondisabled(true);
    setFielddisabled(true);

    store.dispatch(actions.meeseeks.createUser(username, password, email)).then(() => {
      setButtondisabled(false);
      setFielddisabled(false);
      setLoader(false);
    });
  }

  if (active && !loader) {
    return (
      <Redirect to="/active" />
    )
  }

  return(
    <Grow in={true}>
      <Container classes={{root: props.classes.container}}>
      <Typography variant="body1" paragraph={true} align="center">
          {lang.createAccountDescription}
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="on">
          <Grow in={true} timeout={{enter: 100}}>
            <Box width={1}>
              <TextField required 
                variant={props.textvariant} 
                type="text" 
                id="username" 
                fullWidth={true} 
                autoFocus={true}
                value={username} 
                disabled={fielddisabled}
                onChange={(e) => { setUsername(e.target.value) }} 
                label={lang.usernameLbl}
                classes={{root:props.classes.inputField}}
              />
            </Box>
          </Grow>
          <Grow in={true} timeout={{enter: 300}}>
            <Box width={1}>
              <TextField required 
                variant={props.textvariant} 
                type="email" 
                id="email" 
                fullWidth={true}
                value={email}
                disabled={fielddisabled}
                onChange={(e) => { setEmail(e.target.value) }} 
                label={lang.emailLbl} 
                autoComplete="email"
                classes={{root:props.classes.inputField}}
              />
            </Box>
          </Grow>
          <Grow in={true} timeout={{enter: 500}}>
            <Box width={1}>
              <TextField required 
                variant={props.textvariant} 
                type="password" 
                id="password" 
                fullWidth={true}
                value={password}
                disabled={fielddisabled}
                onChange={(e) => { setPassword(e.target.value) }} 
                label={lang.passwordLbl}
                classes={{root:props.classes.inputField}}
              />
            </Box>
          </Grow>
          <Grow in={true} timeout={{enter: 700}}>
            <Box width={1}>
              <TextField required 
                variant={props.textvariant} 
                type="password" 
                id="confirm" 
                fullWidth={true}
                value={confirm}
                disabled={fielddisabled}
                onChange={(e) => { setConfirm(e.target.value) }} 
                label={lang.confirmPassLbl}
                classes={{root:props.classes.inputField}}
              />
            </Box>
          </Grow>
          <Box>{loaderContent}</Box>
          <Grid container direction="row-reverse">
            <Grow in={true} timeout={{enter: 900}}>
              <Button 
                aria-labelledby="submit-label" 
                id="submit" 
                disabled={buttondisabled} 
                variant="contained"
                color="secondary"
                classes={{root:props.classes.button}}
                type="submit"
              >
                <Typography id="submit-label" variant="button" display="block" classes={{root:props.classes.buttonText}}>
                  {lang.submitText}
                </Typography>
              </Button>
            </Grow>
          </Grid>
        </form>
        <Box className={props.classes.link}>
          <Link component={NavLink} to="/">
            {lang.backText}
          </Link>
        </Box>
      </Container>
    </Grow>
  );
}