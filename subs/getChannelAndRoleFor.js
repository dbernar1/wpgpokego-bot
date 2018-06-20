const Promise = require( 'bluebird' );
const { exRaidCategoryId, botRole, } = require( '../config' );
const Discord = require( 'discord.js' );

const recentlyCreatedChannels = {};

const getChannelAndRoleFor = ( gymName, msg, client ) => {
	const channelName = gymName.toLowerCase().replace( / /g, '-' ).replace( /[^a-z0-9\-]+/g, '' );

	const roleName = gymName;

	const existingRole = msg.guild.roles.find( 'name', roleName );

	const theEveryoneRole = msg.guild.roles.find( 'name', '@everyone' );

	return ( existingRole
		? Promise.resolve( existingRole )
		: msg.guild.createRole( { name: roleName, } )
	)
	.then( role => {
		const existingChannel = channelName in recentlyCreatedChannels
			? msg.guild.channels.get( recentlyCreatedChannels[ channelName ] )
			: msg.guild.channels.find( channel => {
				const isAnExChannel = channel.parentID === exRaidCategoryId;
				const nameMatches = channel.name === channelName;

				if ( nameMatches ) {
					console.log( channel.parentID );
				}

				return isAnExChannel && nameMatches;
			} );

		const exRaidCategory = msg.guild.channels.get( exRaidCategoryId );

		return ( existingChannel
			? Promise.resolve( existingChannel )
			: msg.guild.createChannel( channelName, 'text', [
				{
					deny: Discord.Permissions.FLAGS.VIEW_CHANNEL,
					id: theEveryoneRole,
				},
				{
					allow: Discord.Permissions.FLAGS.VIEW_CHANNEL,
					id: role,
				},
				{
					allow: Discord.Permissions.FLAGS.SEND_MESSAGES,
					id: role,
				},
				{
					allow: Discord.Permissions.FLAGS.VIEW_CHANNEL,
					id: botRole,
				},
			].concat( exRaidCategory.permissionOverwrites.array() ) )
		)
		.then( channel => channel.setParent( exRaidCategoryId ) )
		.then( channel => {
			recentlyCreatedChannels[ channelName ] = channel.id;
			return { role, channel, };
		} );
	} );
};

module.exports = getChannelAndRoleFor;
