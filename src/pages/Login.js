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

import IDP from '../components/IDP';

import { store, actions } from '../redux/store';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

const getUserSelector = createSelector([state => state.session], (user) => {
  return user;
});

export default function Login(props) {

  const lang = useSelector(state => state.language)
  const user = useSelector(state => getUserSelector(state))
  const [active, setActive] = useState(false);
  const [loader, setLoader] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [buttondisabled, setButtondisabled] = useState(true);
  const [fielddisabled, setFielddisabled] = useState(false);

  let loaderContent;
  if (loader) {
    loaderContent = (
      <LinearProgress />
    );
  }

  useEffect(() => {
    if (username !== "" && password !== "") {
      setButtondisabled(false);
    }
  }, [username, password])

 useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      setActive(true);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    setLoader(true);
    setFielddisabled(true);
    setButtondisabled(true);

    store.dispatch(actions.meeseeks.login(username, password)).then(() => {
      setFielddisabled(false);
      setButtondisabled(false);
      // this needs to fire last since it will trigger a redirect and unmount the component in the event
      // of successul authentication due to the above effect
      setLoader(false);
    });
  }

  if (active && !loader) {
    return (
      <Redirect to="/active" />
    )
  }

  return (
    <Grow in={true}>
      <Container classes={{root: props.classes.container}}>
        <form onSubmit={handleSubmit} autoComplete="on">
          <Grow in={true} timeout={{enter: 300}}>
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
                label={lang.usernameOrEmailLbl} 
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
                onChange={(e) => { setPassword(e.target.value); }} 
                label={lang.passwordLbl} 
                autoComplete="current-password"
                classes={{root:props.classes.inputField}}
              />
            </Box>
          </Grow>
          <Box>{loaderContent}</Box>
          <Grid container direction="row-reverse">
            <Grow in={true} timeout={{enter: 700}}>
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
                  {lang.loginText}
                </Typography>
              </Button>
            </Grow>
          </Grid>
        </form>
        <IDP classes={props.classes} />
        <Grid container spacing={0} justify="space-between">
          <Grid container item xs={4} sm={6} classes={{root:props.classes.link}} justify="flex-start">
            <Box>
              <Link component={NavLink} to="/reset">
                {lang.resetPassLink}
              </Link>
            </Box>
          </Grid>
          <Grid container item xs={4} sm={6} classes={{root:props.classes.link}} justify="flex-end">
            <Box>
              <Link component={NavLink} to="/create">
                {lang.createAccountLink}
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}