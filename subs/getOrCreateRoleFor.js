const Promise = require( 'bluebird' );
const getRoleNameFor = require( './getRoleNameFor' );
const { extend, } = require( 'underscore' );
const { newRoleOptions } = require( '../config' );

const getOrCreateRoleFor = ( gymName, msg ) =>  {
	const roleName = getRoleNameFor( gymName );

	const existingRole = msg.guild.roles.find( 'name', roleName );

	return ( existingRole
		? Promise.resolve( existingRole )
		: msg.guild.createRole( extend(
			{
				name: roleName,
			},
			newRoleOptions
		) )
	)
};

module.exports = getOrCreateRoleFor;
