const { find, } = require( 'underscore' );
const exRaidGymNames = require( '../ex-raid-gyms' );
const getChannelNameFor = require( './getChannelNameFor' );
const getRoleNameFor = require( './getRoleNameFor' );

const getExRoleNameFor = channelName => {
	const gymName = find(
		exRaidGymNames,
		gymName => channelName === getChannelNameFor( gymName )
	);

	return getRoleNameFor( gymName );
};

module.exports = getExRoleNameFor;
