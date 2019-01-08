const sizeOf = require( 'image-size' );
const { acceptableImageDimensions, } = require( '../config' );

const imageHasAcceptableDimensions = ( filename ) => {
	const dimensions = sizeOf( filename );

	return acceptableImageDimensions.includes(
		`${ dimensions.width }x${ dimensions.height }`
	);
};

module.exports = imageHasAcceptableDimensions;
