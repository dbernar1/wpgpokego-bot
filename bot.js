// https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=setParent
// https://github.com/FoglyOgly/Meowth

const Discord = require( 'discord.js' );
const download = require('image-downloader');
const Promise = require( 'bluebird' );
const {
	deleteDownloaded, findModeratorRole, getChannelAndRoleFor,
	getGymNameFrom, getTextFromImage,
	invitationIsForAnAmbiguous, deleteExRaidChannelsOlderThan,
} = require( './subs' );

const { token, raidCategoryId, exPassesChannelName, developerRole, } = require( './config' );

const client = new Discord.Client();

const processExPassesChannelMessage = ( msg, replyToReUpload=true ) => {
	const anImageWasUploaded = msg.attachments.size > 0 && !! msg.attachments.first().height;

	if ( anImageWasUploaded ) {
		return download.image( {
			url: msg.attachments.first().url,
			dest: './downloads',
		} )
		.then( ( { filename, } ) => {
			return getTextFromImage( filename )
			.then( invitationText => {
				const gymName = getGymNameFrom( invitationText );

				if ( gymName ) {
					if ( invitationIsForAnAmbiguous( gymName ) ) {
						msg.reply(
							'looks like you are going to an EX raid at ' + gymName + '! Since there are a couple of gyms with that same name, let me get ' + findModeratorRole( msg ).toString() + ' to help get you set up.'
						);
					} else {
						return getChannelAndRoleFor( gymName, msg, client )
						.then( ( { channel, role, } ) => {
							const userAlreadyHasRole = !! msg.member.roles.get( role.id );
							if ( userAlreadyHasRole ) {
								if ( replyToReUpload ) {
									msg.reply(
										'looks like you already uploaded that earlier. No worries - just head over to ' + channel.toString() + ' to co-ordinate with other trainers.'
									);
								}
							} else {
								return msg.member.addRole( role )
								.then( () => {
									msg.reply(
										'looks like you are going to an EX raid at ' + gymName + '! Head on over to ' + channel.toString() + ' to co-ordinate with other trainers.'
									);
								} );
							}
						} );
					}
				} else {
					msg.reply(
						'sorry - is that a current EX invite? ' + findModeratorRole( msg ).toString() + ' can you please take a look?'
					);
				}
			} )
			.thenReturn( filename );
		} )
		.then( filename => deleteDownloaded( filename ) )
		.catch( console.log );
	}
};

client.on( 'message', msg => {
	const messageWasSentToExPassesChannel = exPassesChannelName === msg.channel.name;

	if ( messageWasSentToExPassesChannel ) {
		processExPassesChannelMessage( msg );
	}

	const messageIsABotCommand = msg.content.startsWith( '!' );

	if ( messageIsABotCommand ) {
		const [ commandName, ...params ] = msg.content.replace( '!', '' ).split( ' ' );

		switch( commandName ) {
			case 'hello':
				msg.reply('Hello World!');
			break;
			case 'delete-ex':
				const date = params[ 0 ];

				if ( msg.member.hasPermission( Discord.Permissions.FLAGS.MANAGE_CHANNELS ) ) {
					deleteExRaidChannelsOlderThan( date, msg )
					.then( channelNames => msg.reply( 'Deleted: ' + channelNames.join( ', ' ) ) )
					.catch( console.error );
				}
			break;
			case 're-check-ex':
				const messageId = params[ 0 ];

				if ( msg.member.roles.find( 'name', developerRole ) ) {
					const exChannel = msg.guild.channels.find( 'name', exPassesChannelName );

					exChannel.fetchMessages( { after: messageId, limit: 100, } )
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
