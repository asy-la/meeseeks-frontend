import React from 'react';
import { Redirect } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Button from '@material-ui/core/Button';

import { store, actions } from '../redux/store';

export default function Active(props) {

  const state = store.getState();
  const lang = state.language;
  const user = state.session;

  if (!user || Object.keys(user).length <= 0) {
    return (
      <Redirect to="/" />
    );
  }

  function handleLogout(e) {
    e.preventDefault();
    store.dispatch(actions.meeseeks.logout());
  }

  return(
    <Grow in={true}>
      <Container classes={{root: props.classes.container}}>
        <Typography variant="body1" paragraph={true} align="center">
          {lang.greetingText}, {user.username}
        </Typography>
        <Typography variant="body1" paragraph={true} align="center">
          {lang.emailLbl}: {user.primaryEmail.address}
        </Typography>
        <Grid container direction="row-reverse">
          <Button 
            aria-labelledby="submit-label" 
            id="submit" 
            variant="contained"
            color="secondary"
            classes={{root:props.classes.button}}
            onClick={handleLogout}
          >
            <Typography id="submit-label" variant="button" display="block" classes={{root:props.classes.buttonText}}>
              {lang.logoutText}
            </Typography>
          </Button>
        </Grid>
      </Container>
    </Grow>
  );
}