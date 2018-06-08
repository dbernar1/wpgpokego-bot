const exRaidGyms = require( '../ex-raid-gyms' );
const { findWhere, } = require( 'underscore' );

const getExRaidInfo = gymName => findWhere( exRaidGyms, { name: gymName, } );

module.exports = getExRaidInfo;
