const getExRoleNameFor = require( './getExRoleNameFor' );

const getExRaidRoleFor = ( channel ) => {
	return channel.guild.roles.find( role => {
		const isUsedOnTheChannel = channel.permissionOverwrites.some( perm => perm.id === role.id );

		const hasCorrectExRaidRoleName = role.name === getExRoleNameFor( channel.name );

		return isUsedOnTheChannel && hasCorrectExRaidRoleName;
	} );
};

module.exports = getExRaidRoleFor;
