import React from "react";

import Grid from '@material-ui/core/Grid';

function logo(props) {
  const altText = props.name + " logo";

  return (
    <Grid container justify="center">
      <img alt={altText} src={props.src} className={props.className} />
    </Grid>
  );
}

export default logo;