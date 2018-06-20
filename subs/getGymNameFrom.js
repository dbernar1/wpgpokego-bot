const exRaidGyms = require( '../ex-raid-gyms' );
const { find, filter, max, } = require( 'underscore' );
const FuzzySet = require( 'fuzzyset.js' );

const exGymFuzzySet = FuzzySet( exRaidGyms );

const getGymNameFrom = invitationText => {
	const matchByFullName = filter(
		exRaidGyms,
		exGymName => invitationText.includes( exGymName )
	);

	if ( matchByFullName.length ) {
		return max( matchByFullName, match => match.length );
	} else {
		const lineWithMatch = find( invitationText.split( '\n' ), invitationLine => !! exGymFuzzySet.get( invitationLine ) );

		if ( !! lineWithMatch ) {
			const matches = exGymFuzzySet.get( lineWithMatch );

			return matches[ 0 ][ 1 ];
		}
	}
};

module.exports = getGymNameFrom;
