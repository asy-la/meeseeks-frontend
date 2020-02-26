import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';
import Link from '@material-ui/core/Link';
import { NavLink } from 'react-router-dom';

import getLanguage from '../languages';

export default function CreateAccount(props) {

  const lang = getLanguage();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  let buttonvariant = "contained";
  let buttondisabled = false;

  if (username === "" || email === "" || password === "" || confirm === "") {
    buttonvariant = "contained";
    buttondisabled = true;
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return(
    <Grow in={true}>
      <Container>
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
                onChange={(e) => { setUsername(e.target.value) }} 
                label={lang.strings.usernameLbl}
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
                onChange={(e) => { setEmail(e.target.value) }} 
                label={lang.strings.emailLbl} 
                autoComplete="email"
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
                value={email} 
                onChange={(e) => { setPassword(e.target.value) }} 
                label={lang.strings.passwordLbl} 
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
                value={email} 
                onChange={(e) => { setConfirm(e.target.value) }} 
                label={lang.strings.confirmPassLbl} 
              />
            </Box>
          </Grow>
          <Grid container direction="row-reverse">
            <Grow in={true} timeout={{enter: 900}}>
              <Button 
                aria-labelledby="submit-label" 
                id="submit" 
                disabled={buttondisabled} 
                variant={buttonvariant} 
                color="secondary"
              >
                <Typography id="submit-label" variant="button" display="block">
                  {lang.strings.submitText}
                </Typography>
              </Button>
            </Grow>
          </Grid>
        </form>
        <Box className={props.classes.link}>
          <Link component={NavLink} to="/">
            {lang.strings.backText}
          </Link>
        </Box>
      </Container>
    </Grow>
  );
}