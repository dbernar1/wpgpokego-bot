const exRaidGyms = require( '../ex-raid-gyms' );
const { filter, max, } = require( 'underscore' );
const FuzzySet = require( 'fuzzyset.js' );
const { trickyGymNames } = require( '../config' );

const exGymFuzzySet = FuzzySet( exRaidGyms );

const getGymNameFrom = invitationText => {
	const matchByFullName = filter(
		exRaidGyms,
		exGymName => invitationText.includes( exGymName )
	);

	const longestFullGymNameMatch = !! matchByFullName.length && max(
		matchByFullName,
		match => match.length
	);

	if (
		longestFullGymNameMatch
		&& ! trickyGymNames.includes( longestFullGymNameMatch )
	) {
		return longestFullGymNameMatch;
	} else {
		const lineWithBestMatch = invitationText.split( '\n' )
		.reduce( ( lineWithBestMatch, line ) => {
				const matchesForThisLine = exGymFuzzySet.get( line );
				if ( !! matchesForThisLine ) {
					if ( ! lineWithBestMatch ) {
						lineWithBestMatch = matchesForThisLine[ 0 ];
					} else {
						if ( lineWithBestMatch[ 0 ] < matchesForThisLine[ 0 ][ 0 ] ) {
							lineWithBestMatch = matchesForThisLine[ 0 ];
						}
					}
				}

				return lineWithBestMatch;
			},
			null
		);

		if ( !! lineWithBestMatch ) {
			const matches = exGymFuzzySet.get( lineWithBestMatch[ 1 ] );

			return matches[ 0 ][ 1 ];
		}
	}
};

module.exports = getGymNameFrom;
