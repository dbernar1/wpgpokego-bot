const { devUsername } = require( '../config' );

const findDevUser = msg => {
	const devMember = msg.guild.members.find( member => {
		return member.user.username === devUsername;
	} )
	
	return devMember.user;
};

module.exports = findDevUser;
