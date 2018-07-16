const moment = require( 'moment' );
const getChannelNameFor = require( './getChannelNameFor' );
const { exRaidCategoryIds, } = require( '../config' );
const possibleExRaidChannelNames = (
	require( '../ex-raid-gyms' )
).map( gymName => getChannelNameFor( gymName ) );

const getExpiredExRaidChannels = ( msg, date ) => {
	return msg.guild.channels
	.filter( channel => {
		const channelIsUnderExRaidCategory = exRaidCategoryIds.includes( channel.parentID );
		const wasCreatedBeforeProvidedDate = moment( channel.createdTimestamp ).isBefore( date );

		const isAnExRaidChannel = possibleExRaidChannelNames.includes( channel.name );

		return channelIsUnderExRaidCategory && wasCreatedBeforeProvidedDate && isAnExRaidChannel;
	} );
};

module.exports = getExpiredExRaidChannels;
