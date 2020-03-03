import React from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { ReactComponent as GHLogo } from '../icons/github.svg';

import config from '../config';

import { useSelector } from 'react-redux';

export default function IDP(props) {
  //const lang = useSelector(state => state.language)

  const handleGithub = () => {
    window.location.assign(config.auth_host + "/login/github?redirect_uri=" + encodeURIComponent(config.login_page));
    return;
  }

  return ( 
    <Grid container justify="center">
      <Button 
        aria-labelledby="github" 
        id="github" 
        variant="contained"
        classes={{root:props.classes.github}}
        onClick={handleGithub}
      >
        <GHLogo></GHLogo>
        <Typography id="github" variant="button" display="block" classes={{root:props.classes.buttonText}}>
          GitHub
        </Typography>
      </Button>
    </Grid>
  );
}