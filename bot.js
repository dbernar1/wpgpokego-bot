// https://discord.js.org/#/docs/main/stable/class/TextChannel?scrollTo=setParent
// https://github.com/FoglyOgly/Meowth

const Discord = require( 'discord.js' );
const client = new Discord.Client();
const { token, raidCategoryId } = require( './config' );

client.on( 'ready', () => {
	console.log( `Logged in as ${client.user.tag}!` );
} );

client.on( 'message', msg => {
	if ( msg.content.startsWith( '!' ) ) {
		const [ commandName, ...params ] = msg.content.replace( '!', '' ).split( ' ' );

		switch( commandName ) {
			case 'hello':
				msg.reply('Hello World!');
			break;
			case 'raid':
				const channelName = params.join( '-' ).toLowerCase();
				msg.guild.createChannel( channelName, 'text' )
				.then( channel => channel.setParent( raidCategoryId ) )
				.then( channel => msg.channel.send( msg.member.toString() + ' created raid channel ' + channel.toString() ) );
			break;
			case 'endraid':
				if ( msg.channel.parentID === raidCategoryId ) {
					msg.channel.delete();
				} else {
					msg.reply( 'Nuh-uh' );
				}
			break;
			default:
				console.log( commandName );
			break;
		}
	}
} );

client.login( token );
