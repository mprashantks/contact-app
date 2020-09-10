import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import './app.css';
import LoginComponent from "./login/loginComponent";
import ContactsComponent from "./contacts/contactsComponent";

class AppComponent extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={'/'} component={LoginComponent}/>
          <Route exact path={'/contacts'} component={ContactsComponent}/>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default AppComponent;
