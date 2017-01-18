import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Parties = new Mongo.Collection('parties');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish parties that are public or belong to the current user
  Meteor.publish('parties', function partiesPublication() {
    return Parties.find({
      $or: [
        { private: { $ne: true } },
        //{ owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  'parties.insert': (headOfParty, numberOfSeats) => {
    check(headOfParty, String);

    // Make sure the user is logged in before inserting a party
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Parties.insert({
      headOfParty,
      numberOfSeats,
      boarded: 0,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'parties.remove'(partyId) {
    check(partyId, String);

    const party = Parties.findOne(partyId);
    if (party.private && party.owner !== this.userId) {
      // If the party is private, make sure only the owner can delete it
      throw new Meteor.Error('not-authorized');
    }

    Parties.remove(partyId);
  },
  'parties.boardOrUnboard'(partyId, unboard) {
    check(partyId, String);
    check(unboard, Boolean);

    const party = Parties.findOne(partyId);
    if (party.private && party.owner !== this.userId) {
      // If the party is private, make sure only the owner can check it off
      throw new Meteor.Error('not-authorized');
    }

    Parties.update(partyId, { $set: { boarded: party.boarded + (unboard ? -1 : 1) } });
  },
  'parties.setPrivate'(partyId, setToPrivate) {
    check(partyId, String);
    check(setToPrivate, Boolean);

    const party = Parties.findOne(partyId);

    // Make sure only the party owner can make a party private
    if (party.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Parties.update(partyId, { $set: { private: setToPrivate } });
  },
});