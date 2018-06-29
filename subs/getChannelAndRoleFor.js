const getOrCreateRoleFor = require( './getOrCreateRoleFor' );
const getOrCreateChannelFor = require( './getOrCreateChannelFor' );

const getChannelAndRoleFor = ( gymName, msg ) => {
	return getOrCreateRoleFor( gymName, msg )
	.then( role => {
		return getOrCreateChannelFor( gymName, msg, role )
		.then( channel => {
			return { role, channel, };
		} );
	} );
};

module.exports = getChannelAndRoleFor;
