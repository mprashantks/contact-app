import React, {Component} from 'react';

import './contacts.css'
import trash_icon from '../../assets/images/trash-alt-regular.svg'


class ContactComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contactDp: this.props.contactDp,
      contactDisplayName: this.props.contactDisplayName,
      contactEmail: this.props.contactEmail,
      contactPhone: this.props.contactPhone
    };
  }

  render() {
    return (
      <div className={"contact"}>
        <div className={"row"}>
          <div className={"contact_info column"} style={{width:'33.33%'}}>
            <img className="circle profile_picture" alt="contact-dp" src={this.state.contactDp}/>
            <div className={"font name"}>{this.state.contactDisplayName}</div>
          </div>
          <div className={"font email column"} style={{width:'33.33%'}}>{this.state.contactEmail}</div>
          <div className={"font phone column"} style={{width:'25.33%'}}>{this.state.contactPhone}</div>
          <img
            onClick={() => this.props.onDelete(this.props.id)}
            className={"trash"} alt="trash-icon" src={trash_icon}
          />
        </div>
      </div>
    );
  }
}

export default ContactComponent