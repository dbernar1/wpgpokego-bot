const Promise = require( 'bluebird' );
const getExpiredExRaidChannels = require( './getExpiredExRaidChannels' );
const getExRaidRoleFor = require( './getExRaidRoleFor' );

const deleteExRaidChannelsOlderThan = ( date, msg ) => {
	const expiredExRaidChannels = getExpiredExRaidChannels( msg, date );

	const channelNames = expiredExRaidChannels.map( channel => channel.name );

	return Promise.map( expiredExRaidChannels, channel => {
		const channelRole = getExRaidRoleFor( channel );

		return Promise.all( [
			channel.delete(),
			channelRole.delete(),
		] );
	} )
	.thenReturn( channelNames );
};

module.exports = deleteExRaidChannelsOlderThan;
