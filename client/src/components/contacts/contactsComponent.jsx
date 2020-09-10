import React, {Component, Fragment} from 'react';

import NavbarComponent from "./navbarComponent";
import './contacts.css'
import ContactComponent from "./contactComponent";


class ContactsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDp: '',
      userDisplayName: '',
      userEmail: '',
      totalContacts: '',
      contacts: '',
    };
  }

  componentDidMount() {
    const bearer = localStorage.getItem('auth');
    fetch("api/users/contacts", {
      method: 'GET',
      headers: {'Authorization': bearer}
    }).then((res) => {
      if(!res.ok) throw new Error(res.status.toString());
      else return res.json();
    }).then(
      (result) => {
        this.setState({
          userDp: result.userDp,
          userDisplayName: result.userDisplayName,
          userEmail: result.userEmail,
          totalContacts: result.totalContacts,
          contacts: result.contacts,
        });
      },
      (error) => {
        console.log(error);
        this.props.history.push('/')
      }
    );
  }

  render() {
    return (
      <Fragment>
        {
          this.state.userEmail ? <Fragment>
            <NavbarComponent
              {...this.props}
              userDp={this.state.userDp}
              userDisplayName={this.state.userDisplayName}
              userEmail={this.state.userEmail}
            />
            <div id={"contacts-container"}>
              <div>
                <h1 className={"font"}>Contacts</h1>
                <h2 className={"font"}>{"(" + this.state.totalContacts + ")"}</h2>
              </div>
              <div className={"row"}>
                <h3 className="font column">NAME</h3>
                <h3 className="font column">EMAIL</h3>
                <h3 className="font column">PHONE NUMBER</h3>
              </div>

              <div className={"contacts"}>
                {this.state.contacts.map(contact => (
                  <ContactComponent
                    key={contact.key}
                    contactDp={contact.contactDp}
                    contactDisplayName={contact.contactDisplayName}
                    contactEmail={contact.contactEmail}
                    contactPhone={contact.contactPhone}
                  />
                ))}
              </div>
            </div>
          </Fragment> : <span className="h1">
            Loading...
          </span>
        }
      </Fragment>
    );
  }
}

export default ContactsComponent;