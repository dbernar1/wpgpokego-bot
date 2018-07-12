const moment = require( 'moment' );
const getChannelNameFor = require( './getChannelNameFor' );
const { exRaidCategoryIds, } = require( '../config' );
const possibleExRaidChannelNames = (
	require( '../ex-raid-gyms' )
).map( gymName => getChannelNameFor( gymName ) );

const getExpiredExRaidChannels = ( msg, date ) => {
	return msg.guild.channels.findAll( channel => exRaidCategoryIds.includes( channel.parentID ) )
	.filter( channel => {
		const wasCreatedBeforeProvidedDate = moment( channel.createdTimestamp ).isBefore( date );

		const isAnExRaidChannel = possibleExRaidChannelNames.includes( channel.name );

		return wasCreatedBeforeProvidedDate && isAnExRaidChannel;
	} );
};

module.exports = getExpiredExRaidChannels;
