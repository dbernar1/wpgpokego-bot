// https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=setParent
// https://github.com/FoglyOgly/Meowth

const Discord = require( 'discord.js' );
const Promise = require( 'bluebird' );
const {
	deleteExRaidChannelsOlderThan,
	processExPassesChannelMessage,
} = require( './subs' );

const { token, exPassesChannelName, developerRole, } = require( './config' );

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
				const messageId = params[ 0 ];

				if ( msg.member.roles.find(
					'name', developerRole
				) ) {
					const exChannel = msg.guild.channels.find( 'name', exPassesChannelName );

					exChannel.fetchMessages( {
						after: messageId,
						limit: 100,
					} )
					.then( messages => {
						return Promise.mapSeries(
							messages.array(),
							message => processExPassesChannelMessage( message, false )
						)
						.then( () => {
							msg.reply( messages.size > 0
								? 'batch done - next msg ID: ' + messages.first().id
								: 'all done!'
							);
						} );
					} );
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
