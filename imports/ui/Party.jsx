import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Party component - represents a single todo item
export default class Party extends Component {
  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call('parties.setChecked', this.props.party._id, !this.props.party.checked);
  }

  deleteThisParty() {
    Meteor.call('parties.remove', this.props.party._id);
  }

  togglePrivate() {
    Meteor.call('parties.setPrivate', this.props.party._id, ! this.props.party.private);
  }

  render() {
    // Give parties a different className when they are checked off,
    // so that we can style them nicely in CSS
    const partyClassName = classnames({
      checked: this.props.party.checked,
      private: this.props.party.private,
    });

    return (
      <li className={partyClassName}>
        <button className="delete" onClick={this.deleteThisParty.bind(this)}>
          &times;
        </button>


        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate.bind(this)}>
            { this.props.party.private ? 'Private' : 'Public' }
          </button>
        ) : ''}

        <span className="text">
          {this.props.party.headOfParty}: {this.props.party.boarded}/{this.props.party.numberOfSeats}
        </span>
      </li>
    );
  }
}

Party.propTypes = {
  // This component gets the party to display through a React prop.
  // We can use propTypes to indicate it is required
  party: PropTypes.object.isRequired,
  showPrivateButton: React.PropTypes.bool.isRequired,
};