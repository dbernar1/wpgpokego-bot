const getChannelNameFor = gymName => {
	return gymName
		.toLowerCase()
		.replace( /[^a-z0-9]+/g, '-' )
		.replace( /[^a-z0-9\-]+/g, '' );
};

module.exports = getChannelNameFor;
