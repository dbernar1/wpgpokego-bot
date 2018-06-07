const fs = require( 'fs' );

const deleteDownloaded = filename => fs.unlinkSync( filename );

module.exports = deleteDownloaded;
