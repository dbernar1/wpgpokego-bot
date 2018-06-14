const { ambiguousGymNames } = require( '../config' );

const invitationIsForAnAmbiguous = gymName => ambiguousGymNames.includes( gymName );

module.exports = invitationIsForAnAmbiguous;
