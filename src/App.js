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
              <Switch>
                <Route exact path="/" render={() => <Login jss={props.jss} />} />
                <Route exact path="/login" render={() => <Login jss={props.jss} />} />
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