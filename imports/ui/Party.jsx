import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';

// Party component - represents a single todo item
export default class Party extends Component {

  deleteThisParty() {
    Meteor.call('parties.remove', this.props.party._id);
  }

  boardMember() {
    Meteor.call('parties.board', this.props.party._id);
  }

  unboardMember() {
    Meteor.call('parties.unboard', this.props.party._id);
  }

  render() {
    // Give parties a different className when they are checked off,
    // so that we can style them nicely in CSS
    const partyClassName = classnames({
      complete: this.props.party.boarded >= this.props.party.numberOfSeats,
    });

    return (
      <li className={partyClassName}>

        <span className="name-of-party">
          <strong>{this.props.party.headOfParty}</strong> {this.props.party.boarded}/{this.props.party.numberOfSeats} boarded
        </span>

        <span className="buttons">
          <button
            className="board"
            onClick={this.boardMember.bind(this)}
            disabled={this.props.party.boarded >= this.props.party.numberOfSeats}
          >
            Board
          </button>
          <button
            className="unboard"
            onClick={this.unboardMember.bind(this)}
            disabled={this.props.party.boarded === 0}
          >
            Unboard
          </button>
          <button className="delete" onClick={this.deleteThisParty.bind(this)}>
            &times;
          </button>
        </span>
      </li>
    );
  }
}

Party.propTypes = {
  // This component gets the party to display through a React prop.
  // We can use propTypes to indicate it is required
  party: PropTypes.object.isRequired,
};