const Discord = require( 'discord.js' );
const getChannelNameFor = require( './getChannelNameFor' );
const Promise = require( 'bluebird' );
const { exRaidCategoryId, botRole, exAttendeePermissions, } = require( '../config' );

const recentlyCreatedChannels = {};

const getOrCreateChannelFor = ( gymName, msg, role ) => {
	const channelName = getChannelNameFor( gymName );

	const existingChannel = channelName in recentlyCreatedChannels
		? msg.guild.channels.get( recentlyCreatedChannels[ channelName ] )
		: msg.guild.channels.find( channel => {
			const isAnExChannel = channel.parentID === exRaidCategoryId;
			const nameMatches = channel.name === channelName;

			return isAnExChannel && nameMatches;
		} );

	if ( existingChannel ) {
		return Promise.resolve( existingChannel );
	} else {
		const hideChannelFromEveryone = {
			deny: Discord.Permissions.FLAGS.VIEW_CHANNEL,
			id: msg.guild.roles.find( 'name', '@everyone' ),
		};

		const allowBotToSeeChannel = {
			allow: Discord.Permissions.FLAGS.VIEW_CHANNEL,
			id: botRole,
		};

		const copyPermissionsFromExRaidCategory = msg.guild.channels.get( exRaidCategoryId ).permissionOverwrites.array();

		const attendeePermissions = {
			allow: new Discord.Permissions( null, exAttendeePermissions ).bitfield,
			id: role,
		};

		return msg.guild.createChannel(
			channelName,
			'text',
			[].concat(
				hideChannelFromEveryone,
				allowBotToSeeChannel,
				copyPermissionsFromExRaidCategory,
				attendeePermissions
			)
		)
		.then( channel => {
			recentlyCreatedChannels[ channelName ] = channel.id;
			return channel.setParent( exRaidCategoryId );
		} );
	}
};

module.exports = getOrCreateChannelFor;
