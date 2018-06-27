const moment = require( 'moment' );
const getChannelNameFor = require( './getChannelNameFor' );
const { exRaidCategoryId, } = require( '../config' );
const possibleExRaidChannelNames = (
	require( '../ex-raid-gyms' )
).map( gymName => getChannelNameFor( gymName ) );

const getExpiredExRaidChannels = ( msg, date ) => {
	return msg.guild.channels.findAll( 'parentID', exRaidCategoryId )
	.filter( channel => {
		const wasCreatedBeforeProvidedDate = moment( channel.createdTimestamp ).isBefore( date );

		const isAnExRaidChannel = possibleExRaidChannelNames.includes( channel.name );

		return wasCreatedBeforeProvidedDate && isAnExRaidChannel;
	} );
};

module.exports = getExpiredExRaidChannels;
