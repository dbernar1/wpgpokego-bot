// https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=setParent
// https://github.com/FoglyOgly/Meowth

const Discord = require( 'discord.js' );
const Promise = require( 'bluebird' );
const {
	deleteExRaidChannelsOlderThan,
	processExPassesChannelMessage,
	getExRaidRoleFor,
} = require( './subs' );

const {
	exRaidCategoryIds,
	token,
	exPassesChannelName,
	developerRole,
	scheduledDeletionConfigs,
} = require( './config' );

const client = new Discord.Client();

client.on( 'message', msg => {
	const messageWasSentToExPassesChannel = exPassesChannelName === msg.channel.name;
	if ( messageWasSentToExPassesChannel ) {
		processExPassesChannelMessage( msg );
	}

	const messageIsABotCommand = msg.content.startsWith( '!' );
	if ( messageIsABotCommand ) {
		const [
			commandName,
			...params
		] = msg.content.replace( '!', '' ).split( ' ' );

		switch( commandName ) {
			case 'hello':
				msg.reply('Hello World!');
			break;
			case 'delete-ex':
				const date = params[ 0 ];

				if ( msg.member.hasPermission(
					Discord.Permissions.FLAGS.MANAGE_CHANNELS
				) ) {
					deleteExRaidChannelsOlderThan(
						date, msg
					)
					.then( channelNames => msg.reply(
						'Deleted: ' + channelNames.join( ', ' )
					) );
				}
			break;
			case 're-check-ex':
				const getAllMessagesSentSinceMessageWithId = ( exChannel, messageId, previouslyFetchedMessages=[] ) => {
					return exChannel.fetchMessages( {
						after: messageId,
						limit: 100,
					} )
					.then( messages => {
						if ( messages.size > 0 ) {
							return getAllMessagesSentSinceMessageWithId(
								exChannel,
								messages.first().id,
								previouslyFetchedMessages.concat( messages.array() )
							);
						} else {
							return previouslyFetchedMessages;
						}
					} );
				};

				const messageId = params[ 0 ];

				if ( msg.member.roles.find(
					'name', developerRole
				) ) {
					const exChannel = msg.guild.channels.find( 'name', exPassesChannelName );

					getAllMessagesSentSinceMessageWithId( exChannel, messageId )
					.then( messages => Promise.mapSeries(
						messages,
						message => processExPassesChannelMessage( message, false, false )
					) )
					.then( dimensions => {
						console.log(
							dimensions
							.filter( d => !!d )
							.reduce( ( screenSizes, imageInfo ) => {
								if ( imageInfo.dimensions in screenSizes ) {
									screenSizes[ imageInfo.dimensions ]++;
								} else {
									screenSizes[ imageInfo.dimensions ] = 1;
								}

								return screenSizes;
								
							}, {} )
						);

						msg.reply( 'all done!' );
					} );
				}
			break;
			case 'check-roles':
				if ( msg.member.roles.find(
					'name', developerRole
				) ) {
					console.log(
						msg.guild.channels
						.filter(
							channel => exRaidCategoryIds.includes( channel.parentID )
						)
						.map(
							channel => {
								const role = getExRaidRoleFor( channel, msg );

								if ( ! role ) { console.log( '---------', channel.name, '----------' ); }
								return role;
							}
						)
						.map(
							role => {
								return role
								? role.name + ' - ' + role.members.array().length + ' - ' + role.createdAt
								: 'UNKNOWN';
							}
						),
						msg.guild.roles.get( '471739826387943444' ).members.map( member => member.nickname )
					);
				}
			break;
			default:
				console.log( commandName );
			break;
		}
	}
} );

client.on( 'ready', () => {
	console.log( `Logged in as ${client.user.tag}!` );
} );

client.login( token );


const ontime = require( 'ontime' );

scheduledDeletionConfigs.forEach( scheduledDeletionConfig => {
	ontime(
		{ cycle: scheduledDeletionConfig.cycle, },
		ot => {
			return Promise.mapSeries(
				client.guilds.get( scheduledDeletionConfig.guildId ).channels
				.filter( channel => {
					const channelIsInQuestsCategory = channel.parentID === scheduledDeletionConfig.categoryId;

					return channelIsInQuestsCategory
					&& (
						scheduledDeletionConfig.startsWith
							? channel.name.startsWith( scheduledDeletionConfig.startsWith )
							: scheduledDeletionConfig.channelNames.includes( channel.name )
					)
				} ).array(),
				channel => {
					const botHasPermissionToDeleteMessagesFromChannel = channel.permissionsFor( client.user ).has( Discord.Permissions.FLAGS.MANAGE_MESSAGES );
					if ( botHasPermissionToDeleteMessagesFromChannel ) {
						return deleteMessagesFrom( channel );
					}
				}
			)
			.then( () => {
				ot.done();
			} );
		}
	);
} );

const deleteMessagesFrom = channel => {
	return channel.bulkDelete( 99, true )
	.then( deletedMessages => {
		if ( deletedMessages.size > 0 ) {
			return deleteMessagesFrom( channel );
		} else {
			return;
		}
	} );
};
