import React, {Component} from 'react';

import './contacts.css'


class ContactComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactDp: this.props.contactDp,
      contactDisplayName: this.props.contactDisplayName,
      contactEmail: this.props.contactEmail,
      contactPhone: this.props.contactPhone
    };
    console.log(this.state);
  }

  render() {
    return (
      <div className={"contact"}>
        <div className={"row"}>
          <div className={"contact_info column"}>
            <img className="circle profile_picture" alt="contact-dp" src={this.state.contactDp}/>
            <div className={"font name"}>{this.state.contactDisplayName}</div>
          </div>
          <div className={"font email column"}>{this.state.contactEmail}</div>
          <div className={"font phone column"}>{this.state.contactPhone}</div>
        </div>
      </div>
    );
  }
}

export default ContactComponent