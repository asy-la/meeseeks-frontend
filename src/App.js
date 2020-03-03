import React, { useEffect, useState } from 'react';
import { Route } from "react-router-dom";

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import Fade from '@material-ui/core/Fade';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { store, actions } from './redux/store';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import ParamParser from './components/ParamParser';
import Logo from './components/Logo';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import SubmitResetPassword from './pages/SubmitResetPassword';
import CreateAccount from './pages/CreateAccount';
import Active from './pages/Active';

const useStyles = makeStyles(theme => ({
  '@global': {
    html: {
      overflow: 'hidden',
    },
    body: {
      overflow: 'auto',
    }
  },
  root: {
    "& .MuiCircularProgress-root": {
      margin: theme.spacing(3),
    }
  },
  mainPaperContainer: {
    transition: 'ease all .4s',
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: 450,
    '@media (max-width: 600px)': {
      transition: 'ease all .2s',
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      margin: 0,
      width: '100%',
      minWidth: 300,
      maxWidth: '100%',
    },
    '@media (min-width:1366px)': {
      transition: 'ease all .4s',
      width: 600,
      paddingTop: theme.spacing(10),
      paddingBottom: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
  },
  container: {
    padding: 0,
  },
  alert: {
    padding: theme.spacing(1),
  },
  logo: {
    maxHeight: 90,
    maxWidth: 300,
    marginBottom: theme.spacing(2),
    '@media (max-width: 600px)': {
      maxHeight: 70,
      maxWidth: 200,
    }
  },
  inputField: {
    marginTop: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
    '@media (max-width: 600px)': {
      width:'100%',
      marginTop: theme.spacing(2),
      paddingTop: theme.spacing(1.5),
      paddingBottom: theme.spacing(1.5),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
    }
  },
  buttonText: {
    fontWeight: 700,
  },
  link: {
    marginTop: theme.spacing(4)
  },
}));

const getErrorSelector = createSelector([state => state.message], (msg) => {
  return msg;
});

export default function App(props) {
  const error = useSelector(state => getErrorSelector(state));
  const classes = useStyles();
  const mobile = useMediaQuery('(max-width:600px)');
  const [loader, setLoader] = useState(true);
  const [errorMsg, setError] = useState("");
  let content;

  let papervariant = "elevation";
  let papersquare = false;
  let textvariant = "outlined";

  if (mobile) {
    papervariant = "outlined";
    papersquare = true;
    textvariant = "standard";
  }

  const closeError = () => {
    store.dispatch(actions.message.clear());
  }

  useEffect(() => {
    store.dispatch(actions.meeseeks.checkSession()).then(function(){
      setLoader(false);
    });
  }, []);

  useEffect(() => {
    if (error.string === null) {
      setError("");
    } else {
      setError((
        <Fade in={true}>
          <Alert severity={error.type} classes={{root: classes.alert}} onClose={closeError}>
            <Typography variant="body1">
              {error.string}
            </Typography>
          </Alert>
        </Fade>
      ));
    }
  }, [error, classes.alert])

  if (loader) {
    content = (
      <Grid container justify="center">
        <CircularProgress size={64} />
      </Grid>
    )
  } else {
    content = (
      <Box>
        <Route exact path="/reset">
          <ResetPassword textvariant={textvariant} classes={classes} />
        </Route>
        <Route exact path="/reset/:code">
          <SubmitResetPassword textvariant={textvariant} classes={classes} />
        </Route>
        <Route exact path="/create">
          <CreateAccount textvariant={textvariant} classes={classes} />
        </Route>
        <Route exact path="/active">
          <Active classes={classes} />
        </Route>
        <Route exact path="/">
          <Login textvariant={textvariant} classes={classes} />
        </Route>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ParamParser location={props.location}>
        <Grid container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }} 
          className={classes.root}
        >
          <Zoom in={true}>
            <Grid container justify="center">
              <Paper variant={papervariant} elevation={5} square={papersquare} classes={{root:classes.mainPaperContainer}}>
                <Logo name="Asyla" src="/img/Logo_TextOnly_Black.png" className={classes.logo} />
                <Box>{errorMsg}</Box>
                {content}
              </Paper>
            </Grid>
          </Zoom>
        </Grid>
      </ParamParser>
    </React.Fragment>
  );
}