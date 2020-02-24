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

export default function ResetPassword(props) {

  const lang = getLanguage();
  const [email, setEmail] = useState("");

  let buttonvariant = "contained";
  let buttondisabled = false;

  if (email === "") {
    buttonvariant = "contained";
    buttondisabled = true;
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return(
    <Grow in={true}>
      <Container>
        <Typography variant="body2" paragraph={true} align="center">
          {lang.strings.resetPassText}
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
                onChange={(e) => { setEmail(e.target.value) }} 
                label={lang.strings.emailLbl} 
                autoComplete="email"
              />
            </Box>
          </Grow>
          <Grid container direction="row-reverse">
            <Grow in={true} timeout={{enter: 500}}>
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