const Promise = require( 'bluebird' );
const tesseract = require( 'node-tesseract' );

const getTextFromImage = filename => Promise.promisify( tesseract.process )( filename );

module.exports = getTextFromImage;
