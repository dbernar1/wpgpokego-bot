const { exRaidCategoryId, } = require( '../config' );
const getExRaidInfo = require( './getExRaidInfo' );

const findExRaidChannelFor = ( msg, gymName ) => {
	const { channelName } = getExRaidInfo( gymName );

	return msg.guild.channels.find( channel => {
		const channelIsInTheExRaidCategory = channel.parentID === exRaidCategoryId;
		const channelNameMatchesGymName = channel.name === channelName;

		return channelIsInTheExRaidCategory && channelNameMatchesGymName;
	} );
};

module.exports = findExRaidChannelFor;
