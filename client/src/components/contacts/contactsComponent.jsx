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
        this.props.history.push('/');
      }
    );
  }

  handleDelete = (key) => {
    const bearer = localStorage.getItem('auth');
    fetch(`api/users/deleteContact?resourceName=${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: {'Authorization': bearer}
    }).then((res) => {
      if(!res.ok) throw new Error(res.status.toString());
      else return res;
    }).then(
      () => {
        const contacts = this.state.contacts.filter(c => c.key !== key);
        this.setState({
          contacts: contacts,
          totalContacts: contacts.length
        });
      },
      (error) => {
        console.log(error);
      }
    );
  };

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
                <h3 className="font column" style={{width:'33.33%'}}>NAME</h3>
                <h3 className="font column" style={{width:'33.33%'}}>EMAIL</h3>
                <h3 className="font column" style={{width:'25.33%'}}>PHONE NUMBER</h3>
              </div>

              <div className={"contacts"}>
                {this.state.contacts.map(contact => (
                  <ContactComponent
                    key={contact.key}
                    id={contact.key}
                    contactDp={contact.contactDp}
                    contactDisplayName={contact.contactDisplayName}
                    contactEmail={contact.contactEmail}
                    contactPhone={contact.contactPhone}
                    onDelete={this.handleDelete}
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