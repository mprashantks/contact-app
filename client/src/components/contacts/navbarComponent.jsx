import React, {Component} from 'react';

import './contacts.css'


class NavbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDp: this.props.userDp,
      userDisplayName: this.props.userDisplayName,
      userEmail: this.props.userEmail
    };
  };

  signOut = () => {
    localStorage.removeItem('auth');
    this.props.history.push('/');
  };

  render() {
    return (
      <div id={"navbar"}>
        <div className={"navbar_container"}>
          <div className={"user_info"}>
            <img className="circle profile_picture" alt="user-dp" src={this.state.userDp}/>
            <div className={"mar"}>
              <div className={"font name"}>{this.state.userDisplayName}</div>
              <div className={"font email"}>{this.state.userEmail}</div>
            </div>
          </div>
          <i onClick={this.signOut} className="fa fa-sign-out logout_logo" style={{cursor:'pointer'}}></i>
        </div>
      </div>
    );
  }
}

export default NavbarComponent;