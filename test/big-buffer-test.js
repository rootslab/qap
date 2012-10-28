
var log = console.log,
    assert = require( 'assert' ),
    QuickAsciiParser = require( '../' ).Qap,
    pattern = '----------hellofolks\r\n\r\n',
    bpattern = new Buffer( pattern ),
    plen = pattern.length,
    mb = 900,
    dlen = mb * 1024 * 1024,
    data = new Buffer( dlen ),
    qap = new QuickAsciiParser( bpattern );

var occ = Math.floor( dlen / plen / plen / plen / plen ),
    i = occ,
    indexes = [],
    stime = Date.now();

log( '- creating test buffer..(' + mb +' MB)' );
for ( ; i < dlen - 1; i += occ ) {
    indexes.push( i );
    bpattern.copy( data, i );
}

log( '- buffer data copied in',( Date.now() - stime ) / 1000, 'secs' );
log( '- pattern length:', bpattern.length, 'bytes' );
log( '- patterns written:', indexes.length );

var sptime = Date.now(),
    results = qap.parse( data );
log( '\n- input data was parsed in', ( ( Date.now() - sptime ) / 1000 ).toFixed( 2 ), 'secs' );
log( '- total results:', results.length );
assert.equal( results.length, indexes.length, 'parsed results don\'t match with existing patterns' );
log( '- comparing parsed results and pre-recorded indexes' );
assert.deepEqual( results, indexes, 'indexes and parsed indexes don\'t match' );
log( '- all tests passed in',( ( Date.now() - stime ) / 1000 ).toFixed( 2 ), 'secs\n');