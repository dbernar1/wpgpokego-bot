const Promise = require( 'bluebird' );
const moment = require( 'moment' );
const { exRaidCategoryId, botRole, } = require( '../config' );

const deleteExRaidChannelsOlderThan = ( date, msg ) => {
	const expiredChannels = msg.guild.channels.findAll( 'parentID', exRaidCategoryId )
	.filter( exChannel => moment( exChannel.createdTimestamp ).isBefore( date ) );

	const channelNames = expiredChannels.map( channel => channel.name );

	return Promise.map( expiredChannels, channel => {
		const channelRole = msg.guild.roles.find( 'id', channel.permissionOverwrites.find( perm => perm.allow > 0 && perm.id != botRole ).id );
		return Promise.all( [
			channel.delete(),
			channelRole.delete(),
		] );
	} )
	.thenReturn( channelNames );
};

module.exports = deleteExRaidChannelsOlderThan;
