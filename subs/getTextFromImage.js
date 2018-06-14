const Promise = require( 'bluebird' );
const tesseract = require( 'node-tesseract' );
const { execSync } = require( 'child_process' );
const fs = require( 'fs' );

const getTextFromImage = filename => {
	const processedFileName = filename.replace( /([^\.]+)/, '$&2' );
	execSync( `./textcleaner ${ filename } ${ processedFileName }` );

	return Promise.promisify( tesseract.process )( processedFileName )
	.tap( () => fs.unlinkSync( processedFileName ) );
};

module.exports = getTextFromImage;
