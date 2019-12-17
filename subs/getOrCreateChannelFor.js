const Discord = require( 'discord.js' );
const getChannelNameFor = require( './getChannelNameFor' );
const Promise = require( 'bluebird' );
const { newChannelEmbed, exRaidCategoryIds, exStaffChannelId, botRole, } = require( '../config' );
const { find, max, extend, } = require( 'underscore' );

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

const getOrCreateChannelFor = ( gymName, msg ) => {
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

		const allowBotToSeeChannel = {
			allow: Discord.Permissions.FLAGS.VIEW_CHANNEL,
			id: botRole,
		};

		const copyPermissionsFromExRaidCategory = msg.guild.channels.get( exRaidCategoryId ).permissionOverwrites.array();

		return msg.guild.createChannel(
			channelName,
			'text',
			[].concat(
				allowBotToSeeChannel,
				copyPermissionsFromExRaidCategory
			)
		)
		.then( channel => {
			channel.sendEmbed( extend(
				{},
				newChannelEmbed,
				{ description: newChannelEmbed.description.replace( '%gymName%', gymName ), }
			) );
			msg.guild.channels.get( exStaffChannelId ).send( 'Created new channel for ' + gymName );

			recentlyCreatedChannels[ channelName ] = channel.id;
			return channel.setParent( exRaidCategoryId );
		} );
	}
};

module.exports = getOrCreateChannelFor;
