const download = require( 'image-downloader' );
const deleteDownloaded = require( './deleteDownloaded' );
const findModeratorRole = require( './findModeratorRole' );
const getChannelAndRoleFor = require( './getChannelAndRoleFor' );
const getGymNameFrom = require( './getGymNameFrom' );
const getTextFromImage = require( './getTextFromImage' );
const invitationIsForAnAmbiguous = require( './invitationIsForAnAmbiguous' );
const { raidCategoryId, } = require( '../config' );

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
						return getChannelAndRoleFor( gymName, msg )
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

module.exports = processExPassesChannelMessage;
