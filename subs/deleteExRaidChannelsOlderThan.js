const Promise = require( 'bluebird' );
const getExpiredExRaidChannels = require( './getExpiredExRaidChannels' );

const deleteExRaidChannelsOlderThan = ( date, msg ) => {
	const expiredExRaidChannels = getExpiredExRaidChannels( msg, date );
	const channelNames = expiredExRaidChannels.map( channel => channel.name );

	return Promise.map( expiredExRaidChannels.array(), channel => channel.delete() )
	.thenReturn( channelNames );
};

module.exports = deleteExRaidChannelsOlderThan;
