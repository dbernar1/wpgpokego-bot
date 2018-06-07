const { find, map } = require( 'underscore' );
const exRaidGyms = require( '../ex-raid-gyms' );

const findMatchingGymNameIn = text => {
	return find(
		map( exRaidGyms, gym => gym.name ),
		gymName => text.includes( gymName )
	);
};

module.exports = findMatchingGymNameIn;
