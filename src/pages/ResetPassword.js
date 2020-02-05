import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import queryString from 'query-string';

import Reset from '../components/ResetPassword';
import PasswordConfirm from '../components/PasswordConfirmation';
import Link from '../components/Link';

function ResetPassword(props) {

  let values = queryString.parse(props.location.location.search);
  let content = (<Reset className={props.jss.classes.reset} classes={props.jss.rules.raw} />);


  if (values.code) {
    content = (<PasswordConfirm classes={props.jss.rules.raw} code={values.code} location={props.location} />)
  }

  const StyledLink = injectSheet(props.jss.rules.raw)(Link)

  return (
    <div>
      <section id="reset">
        {content}
      </section>
      <section id="links">
        <StyledLink href="/">Back</StyledLink>
      </section>
    </div>
  );
}

ResetPassword.propTypes = {
  jss: PropTypes.object.isRequired
}

export default ResetPassword