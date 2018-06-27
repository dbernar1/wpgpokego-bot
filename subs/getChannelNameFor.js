const getChannelNameFor = gymName => {
	return gymName
		.toLowerCase()
		.replace( / /g, '-' )
		.replace( /[^a-z0-9\-]+/g, '' );
};

module.exports = getChannelNameFor;
