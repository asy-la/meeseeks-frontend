import React, { useState, useEffect } from 'react';
import { NavLink, useParams, Redirect } from 'react-router-dom';

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

export default function SubmitResetPassword(props) {

  const lang = useSelector(state => state.language);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loader, setLoader] = useState(false);
  const [buttondisabled, setButtondisabled] = useState(true);
  const [fielddisabled, setFielddisabled] = useState(false);
  const [done, setDone] = useState(false);
  const passwordRe = /[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?\d]/g;

  let { code } = useParams();

  let loaderContent;
  if (loader) {
    loaderContent = (
      <LinearProgress />
    );
  }

  useEffect(() => {
    if (password !== "" && confirm !== "" && password === confirm) {
      setButtondisabled(false);
    }
  }, [password, confirm])

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

    store.dispatch(actions.meeseeks.submitPasswordReset(code, password)).then((result) => {

      console.log(result);
      setButtondisabled(false);
      setFielddisabled(false);
      setLoader(false);
      setDone(result);
    });
  }

  if (done) {
    return (
      <Redirect to="/active" />
    )
  }

  return (
    <Grow in={true}>
      <Container classes={{root: props.classes.container}}>
        <form onSubmit={handleSubmit} autoComplete="on">
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
                variant="contained"
                color="secondary"
                disabled={buttondisabled}
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
  )
}