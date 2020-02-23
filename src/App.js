import React from 'react';
//import { Route, Switch } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Logo from './components/Logo';
import Login from './pages/Login';

const useStyles = makeStyles(theme => ({
  '@global': {
    html: {
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: theme.palette.primary.main,
    },
    body: {
      height: '100%',
      width: '100%',
      overflow: 'auto',
      backgroundColor: theme.palette.primary.main,
    }
  },
  root: {
    '& .MuiTextField-root': {
      marginTop: theme.spacing(2),
    },
    '& .MuiButton-root': {
      float: 'right',
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    '& .MuiTypography-button': {
      fontWeight: 700,
    },
    '& .MuiPaper-root': {
      transition: 'ease all .4s',
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      width: '100%',
      minWidth: 300,
      maxWidth: 450,
    },
    '& .MuiContainer-root': {
      padding: 0,
    },
    '@media (max-width: 600px)': {
      '& .MuiPaper-root': {
        transition: 'ease all .2s',
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        margin: 0,
        width: '100%',
        minWidth: 300,
        maxWidth: '100%',
        overflow: 'hidden'
      },
      '& .MuiButton-root': {
        width:'100%',
        marginTop: theme.spacing(2),
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      },
    },
    '@media (min-width:1366px)': {
      '& .MuiPaper-root': { 
        transition: 'ease all .4s',
        maxWidth: 600,
        paddingTop: theme.spacing(10),
        paddingBottom: theme.spacing(10),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      }
    }
  },
  logo: {
    maxHeight: 90,
    maxWidth: 300,
    '@media (max-width: 600px)': {
      maxHeight: 70,
      maxWidth: 200,
    }
  }
}));

export default function App() {
  const classes = useStyles();
  const mobile = useMediaQuery('(max-width:600px)');

  let papervariant = "elevation";
  let papersquare = false;
  let textvariant = "outlined";

  if (mobile) {
    papervariant = "outlined";
    papersquare = true;
    textvariant = "standard"
  }

  return (
    <React.Fragment>
    <CssBaseline />
    <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }} 
          className={classes.root}>
      <Paper variant={papervariant} elevation={5} square={papersquare}>
        <Container>
          <Logo name="Asyla" src="img/Logo_TextOnly_Black.png" className={classes.logo} />
          <Login textvariant={textvariant} />
        </Container>
      </Paper>
    </Grid>
  </React.Fragment>
  )
}