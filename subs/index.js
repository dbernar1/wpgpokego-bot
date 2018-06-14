const deleteDownloaded = require( './deleteDownloaded' );
const deleteExRaidChannelsOlderThan = require( './deleteExRaidChannelsOlderThan' );
const findDevUser = require( './findDevUser' );
const getChannelAndRoleFor = require( './getChannelAndRoleFor' );
const getGymNameFrom = require( './getGymNameFrom' );
const getTextFromImage = require( './getTextFromImage' );
const invitationIsForAnAmbiguous = require( './invitationIsForAnAmbiguous' );

module.exports = {
	deleteDownloaded,
	deleteExRaidChannelsOlderThan,
	findDevUser,
	getChannelAndRoleFor,
	getGymNameFrom,
	getTextFromImage,
	invitationIsForAnAmbiguous,
};
