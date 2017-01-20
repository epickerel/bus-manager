import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Parties = new Mongo.Collection('parties');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish parties that are public or belong to the current user
  Meteor.publish('parties', function partiesPublication() {
    return Parties.find({});
  });
}

Meteor.methods({
  'parties.insert': (headOfParty, numberOfSeats) => {
    check(headOfParty, String);

    Parties.insert({
      headOfParty,
      numberOfSeats,
      boarded: 0,
      createdAt: new Date(),
    });
  },
  'parties.remove'(partyId) {
    check(partyId, String);

    const party = Parties.findOne(partyId);

    Parties.remove(partyId);
  },
  'parties.board'(partyId) {
    check(partyId, String);

    const party = Parties.findOne(partyId);

    Parties.update(partyId, { $set: { boarded: (party.boarded + 1) } });
  },
  'parties.unboard'(partyId) {
    check(partyId, String);

    const party = Parties.findOne(partyId);

    Parties.update(partyId, { $set: { boarded: (party.boarded - 1) } });
  },
});