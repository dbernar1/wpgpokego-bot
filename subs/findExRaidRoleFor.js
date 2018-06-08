const getExRaidInfo = require( './getExRaidInfo' );

const findExRaidRoleFor = ( msg, gymName ) => {
	const { role } = getExRaidInfo( gymName );

	return msg.guild.roles.find( 'name', role );
};

module.exports = findExRaidRoleFor;
