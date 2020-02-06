import React from "react";
import { Route, Switch } from "react-router-dom";
import Paper from '@material-ui/core/Paper';

import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import CreateAccount from './pages/CreateAccount';
import VerifyEmail from "./pages/VerifyEmail";

function App(props) {

  return (
    <div className={props.jss.classes.app}>
      <div className="table">
        <div className="container">
          <div className="content">
            <Paper className={props.jss.classes.paper}>
              <img alt="Asyla Logo" src="img/Logo_TextOnly_Black.png" style={{width: 200, margin: '0 auto', marginBottom: '1em', display: 'inherit'}} />
              <Switch>
                <Route exact path="/" render={(location) => <Login jss={props.jss} location={location} />} />
                <Route exact path="/login" render={(location) => <Login jss={props.jss} location={location}/>} />
                <Route exact path="/reset" render={(location) => <ResetPassword jss={props.jss} location={location} />} />
                <Route exact path="/create" render={(location) => <CreateAccount jss={props.jss} location={location} />} />
                <Route exact path="/verify" render={(location) => <VerifyEmail jss={props.jss} location={location} />} />
              </Switch>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;