import React from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import MaterialLink from '@material-ui/core/Link';
import { Link } from 'react-router-dom';

const style = {
  link: {}
};

class CoreLink extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired
  }

  render() {
    return (
      <Link to={this.props.href} className={this.props.className} style={this.props.style}>{this.props.children}</Link>
    )
  }
}

class External extends React.Component {
  static propTypes = {
    href: PropTypes.string.isRequired
  }

  render() {
    return (
      <a href={this.props.href} className={this.props.className} style={this.props.style}>{this.props.children}</a>
    )
  }
}

class StyledLink extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    href: PropTypes.string,
    style: PropTypes.object,
    ext: PropTypes.bool
  }

  render() {
    let link = CoreLink;

    if (this.props.ext) {
      link = External;
    }
    
    return(
      <MaterialLink
        component={link}
        href={this.props.href}
        to={this.props.to}
        classes={{
          root: this.props.classes.link
        }}
        onClick = {this.props.onClick}
        style={this.props.style}
      >{this.props.children}</MaterialLink>
    );
  }
}

export default injectSheet(style)(StyledLink)