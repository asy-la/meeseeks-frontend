import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';

import Create from '../components/CreateAccount';
import Link from '../components/Link';

function CreateAccount(props) {

  let content = (<Create classes={props.jss.rules.raw} />);
  let StyledLink = injectSheet(props.jss.rules.raw)(Link)

  return (
    <div>
      <section id="create">
        {content}
      </section>
      <section id="links">
        <StyledLink href="/">Back</StyledLink>
      </section>
    </div>
  );
}

CreateAccount.propTypes = {
  jss: PropTypes.object.isRequired
}

export default CreateAccount