import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { Parties } from '../api/parties.js';

import Party from './Party.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const headOfParty = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const passengers = Number(ReactDOM.findDOMNode(this.refs.passengers).value.trim()) || 1;
    Meteor.call('parties.insert', headOfParty, passengers);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.name).value = '';
    ReactDOM.findDOMNode(this.refs.passengers).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderParties() {
    let filteredParties = this.props.parties;
    if (this.state.hideCompleted) {
      filteredParties = filteredParties.filter(party => !party.checked);
    }
    return filteredParties.map((party) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = party.owner === currentUserId;
 
      return (
        <Party
          key={party._id}
          party={party}
          showPrivateButton={showPrivateButton}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Parties
          </label>

          <AccountsUIWrapper />

          { this.props.currentUser ?
            <form className="new-party" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="name"
                placeholder="Head of party"
              />
              <input
                type="text"
                ref="passengers"
                placeholder="Number of passengers"
              />
              <button type="submit"></button>
            </form> : ''
          }

        </header>

        <ul>
          {this.renderParties()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  parties: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('parties');

  return {
    parties: Parties.find({}, { sort: { headOfParty: -1 } }).fetch(),
    incompleteCount: 1, //Parties.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App);