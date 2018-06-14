const exRaidGyms = require( '../ex-raid-gyms' );
const { find, } = require( 'underscore' );
const FuzzySet = require( 'fuzzyset.js' );

const exGymFuzzySet = FuzzySet( exRaidGyms );

const getGymNameFrom = invitationText => {
	const matchByFullName = find(
		exRaidGyms,
		exGymName => invitationText.includes( exGymName )
	);

	if ( matchByFullName ) {
		return matchByFullName;
	} else {
		const lineWithMatch = find( invitationText.split( '\n' ), invitationLine => !! exGymFuzzySet.get( invitationLine ) );

		if ( !! lineWithMatch ) {
			return exGymFuzzySet.get( lineWithMatch )[ 0 ][ 1 ];
		}
	}
};

module.exports = getGymNameFrom;
