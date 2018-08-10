const getChannelNameFor = gymName => {
	const channelName = gymName
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /[^a-z0-9\-]+/g, '' );

	return channelName.endsWith( '-' )
	? channelName.slice( 0, -1 )
	: channelName;
};

module.exports = getChannelNameFor;
