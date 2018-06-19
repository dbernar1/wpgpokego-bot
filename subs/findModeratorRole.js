const { moderatorRole } = require( '../config' );

const findModeratorRole = msg => {
	return msg.guild.roles.get( moderatorRole );
};

module.exports = findModeratorRole;
