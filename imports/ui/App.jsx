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
      filter: '',
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

  handleFilter(event) {
    const text = ReactDOM.findDOMNode(this.refs.filter).value.trim();
    this.setState({
      filter: text,
    });
  }

  filter(text) {
    text = text.toLowerCase();
    return this.props.parties.filter(party => {
      var name = party.headOfParty.toLowerCase();
      return (name.indexOf(text) !== -1);
    });
  }

  renderParties() {
    const text = this.state.filter;
    let filteredParties = !text ? this.props.parties : this.filter(text);
    return filteredParties.map((party) => {
      return (
        <Party
          key={party._id}
          party={party}
        />
      );
    });
  }

  render() {
    return (
      <div className="container">
        <header>
          <h1>Bus Parties ({this.props.completeCount} seats needed)</h1>

          <form className="filter">
            <input
              type="text"
              ref="filter"
              placeholder="Type to filter"
              onKeyUp={ this.handleFilter.bind(this) }
            />
          </form>

        </header>

        <ul id="parties">
          {this.renderParties()}
        </ul>

        <footer>
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
            <button type="submit">Add</button>
          </form>
        </footer>
      </div>
    );
  }
}

App.propTypes = {
  parties: PropTypes.array.isRequired,
  completeCount: PropTypes.number.isRequired,
};

export default createContainer(() => {
  Meteor.subscribe('parties');

  var parties = Parties.find({}, { sort: { headOfParty: -1 } }).fetch();
  var remainingSeats = 0;
  parties.forEach(party => {
    remainingSeats += party.numberOfSeats - party.boarded;
  });
  return {
    parties: parties,
    completeCount: remainingSeats,
  };
}, App);