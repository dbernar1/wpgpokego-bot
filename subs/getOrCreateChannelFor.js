const Discord = require( 'discord.js' );
const getChannelNameFor = require( './getChannelNameFor' );
const Promise = require( 'bluebird' );
const { newChannelMessage, exRaidCategoryIds, botRole, exAttendeePermissions, } = require( '../config' );
const { find, max, } = require( 'underscore' );

const figureOutWhichWaveToAddThisNewChannelTo = msg => {
	const channelsByWave = exRaidCategoryIds.map(
		waveCategoryId => ( {
			waveCategoryId,
			channels: msg.guild.channels.filter(
				channel => channel.parentID === waveCategoryId
			),
		} )
	);

	const waveWithoutAnyChannels = find(
		channelsByWave,
		wave => 0 === wave.channels.size
	);

	if ( waveWithoutAnyChannels ) {
		return waveWithoutAnyChannels.waveCategoryId;
	} else {
		const waveWithNewestChannel = max(
			channelsByWave,
			wave => {
				const mostRecentChannelInWave = max(
					wave.channels.array(),
					channel => channel.createdTimestamp
				);

				return mostRecentChannelInWave.createdTimestamp;
			}
		);

		return waveWithNewestChannel.waveCategoryId;
	}
};

const recentlyCreatedChannels = {};

const getOrCreateChannelFor = ( gymName, msg, role ) => {
	const channelName = getChannelNameFor( gymName );

	const existingChannel = channelName in recentlyCreatedChannels
		? msg.guild.channels.get( recentlyCreatedChannels[ channelName ] )
		: msg.guild.channels.find( channel => {
			const isAnExChannel = exRaidCategoryIds.includes( channel.parentID );
			const nameMatches = channel.name === channelName;

			return isAnExChannel && nameMatches;
		} );

	if ( existingChannel ) {
		return Promise.resolve( existingChannel );
	} else {
		const exRaidCategoryId = figureOutWhichWaveToAddThisNewChannelTo( msg );

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
			channel.send( newChannelMessage );

			recentlyCreatedChannels[ channelName ] = channel.id;
			return channel.setParent( exRaidCategoryId );
		} );
	}
};

module.exports = getOrCreateChannelFor;
