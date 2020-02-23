import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import getLanguage from '../languages';

function Login(props) {

  const lang = getLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  let buttonvariant = "contained";
  let buttondisabled = false;

  if (username === "" || password === "") {
    buttonvariant = "contained";
    buttondisabled = true;
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return(
    <form onSubmit={handleSubmit} autoComplete="on">
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
          autoComplete="email"
        />
      </Box>
      <Box width={1}>
        <TextField required 
          variant={props.textvariant} 
          type="password" 
          id="password" 
          fullWidth={true}
          value={password} 
          onChange={(e) => { setPassword(e.target.value) }} 
          label={lang.strings.passwordLbl} 
          autoComplete="current-password"
        />
      </Box>
      <Button 
        aria-labelledby="submit-label" 
        id="submit" 
        disabled={buttondisabled} 
        variant={buttonvariant} 
        color="secondary"
      >
        <Typography id="submit-label" variant="button" display="block">
          {lang.strings.loginText}
        </Typography>
      </Button>
    </form>
  );
}

export default Login