import React, {Component} from 'react';
import {GoogleLogin} from 'react-google-login';

import './login.css'
import google_icon from '../../assets/images/google-icon.png'


class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clientId: '',
      scope: ''
    };
  }

  componentDidMount() {
    fetch("api/users/signin/oauth2/creds", {
      method: 'GET'
    }).then(res => res.json()).then(
      (result) => {
        this.setState({
          clientId: result.clientId,
          scope: result.scope.join(' ')
        });
      },
      (error) => {
        throw new Error(error);
      }
    )
  }

  responseGoogle = (response) => {
    fetch(`api/users/signin/oauth2?code=${encodeURIComponent(response.code)}`, {
      method: 'GET'
    }).then((res) => {
      if(!res.ok) throw new Error(res.status.toString());
      else return res.json();
    }).then(
      (result) => {
        localStorage.setItem('auth', result.data);
        this.props.history.push('/contacts')
      },
      (error) => {
        console.log(error);
      }
    )
  };

  render() {
    return (
      <div id="login-form">
        <div className="form-signin">
          <img className="google_icon" alt="google-icon" src={google_icon}/>
          {
            this.state.clientId ? <GoogleLogin
              clientId={this.state.clientId}
              render={renderProps => (
                <span onClick={renderProps.onClick} className="google_login" style={{cursor:'pointer'}}>Sign in with Google</span>
              )}
              accessType="offline"
              responseType="code"
              scope={this.state.scope}
              approvalPrompt="force"
              prompt='consent'
              onSuccess={this.responseGoogle}
              onFailure={this.responseGoogle}
            /> : <span className="google_login">
              Loading...
            </span>
          }

          <input type="email" id="inputEmail" className="form-control" placeholder="Email" required="" autoFocus=""/>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required=""/>

          <button className="btn" type="submit">Sign in</button>
        </div>
      </div>
    );
  }
}

export default LoginComponent;