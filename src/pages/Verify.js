import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import { store, actions } from '../redux/store';

export default function Verify() {
  const [done, setDone] = useState(false);
  let { code } = useParams();

  useEffect(() => {
    store.dispatch(actions.meeseeks.verifyEmail(code)).then(() => {
      setDone(true);
    })
  }, [code]);


  if (done) {
    return (
      <Redirect to='/' />
    );
  }

  return (
    <Grid container justify="center">
      <CircularProgress size={64} />
    </Grid>
  )
};