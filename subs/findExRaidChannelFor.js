const { exRaidCategoryId, } = require( '../config' );

const findExRaidChannelFor = ( msg, matchingGymName ) => {
	return msg.guild.channels.find( channel => {
		const channelIsInTheExRaidCategory = channel.parentID === exRaidCategoryId;
		const channelNameMatchesGymName = channel.name === matchingGymName.toLowerCase();

		return channelIsInTheExRaidCategory && channelNameMatchesGymName;
	} );
};

module.exports = findExRaidChannelFor;
