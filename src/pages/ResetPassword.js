import React, { useState, useEffect } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Link from '@material-ui/core/Link';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Redirect, NavLink } from 'react-router-dom';

import { store, actions } from '../redux/store';
import { useSelector } from 'react-redux';

export default function ResetPassword(props) {

  const lang = useSelector(state => state.language)
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  const [buttondisabled, setButtondisabled] = useState(true);
  const [fielddisabled, setFielddisabled] = useState(false);
  const [done, setDone] = useState(false);

  let loaderContent;
  if (loader) {
    loaderContent = (
      <LinearProgress />
    );
  }

  useEffect(() => {
    if (email !== "") {
      setButtondisabled(false);
    }
  }, [email])

  function handleSubmit(e) {
    e.preventDefault();

    setLoader(true);
    setFielddisabled(true);
    setButtondisabled(true);
    store.dispatch(actions.meeseeks.sendPasswordReset(email)).then((result) => {
      setFielddisabled(false);
      setButtondisabled(false);
      setLoader(false);
      setDone(result);
    });
  }

  if (done) {
    return (
      <Redirect to="/active" />
    )
  }

  return(
    <Grow in={true}>
      <Container classes={{root: props.classes.container}}>
        <Typography variant="body1" paragraph={true} align="center">
          {lang.resetPassText}
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="on">
          <Grow in={true} timeout={{enter: 300}}>
            <Box width={1}>
              <TextField required 
                variant={props.textvariant} 
                type="email" 
                id="email" 
                fullWidth={true} 
                autoFocus={true}
                value={email}
                disabled={fielddisabled}
                onChange={(e) => { setEmail(e.target.value) }} 
                label={lang.emailLbl} 
                autoComplete="email"
                classes={{root:props.classes.inputField}}
              />
            </Box>
          </Grow>
          <Box>{loaderContent}</Box>
          <Grid container direction="row-reverse">
            <Grow in={true} timeout={{enter: 500}}>
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