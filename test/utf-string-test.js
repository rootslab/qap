var log = console.log,
    assert = require( 'assert' ),
    Qap = require( '../' ).Qap,
    spattern = '-----hèllòfòlks°¿',
    splen = spattern.length,
    bpattern = new Buffer( spattern );

log( '- use an utf-8 pattern string: ' + spattern );
log( '- create a Buffer from utf-8 string' );
var qutf = Qap( bpattern ),
    data = new Buffer( 1024 * 1024 ),
    indexes = [ 26000, 560000, 860000, 960000 ],
    results = null;

log( '- pattern utf-8 string length is:', spattern.length, 'chars' );
log( '- pattern buffer length is:', bpattern.length, 'bytes' );
log( '- copy some pattern string in test data to parse' );
for ( var i = 0; i < indexes.length; ++i ) {
    bpattern.copy( data, indexes[ i ] );
}

log( '- parsing test data for patterns' );
results = qutf.parse( data );

log( '- check if parsed results is equal to', 4 );
assert.equal( results.length, 4 );
log( '- compare results with pre-defined indexes' );
assert.deepEqual( indexes, results, 'results indexes don\'t match' );

/** /
log( '- create pattern with 2 sub-pattern side by side' );
for ( ; i < n; ++i ) {
    spattern += spattern;
} 

log( '- create a Buffer copying 2 patterns side by side' );
bpattern.copy( data, bpattern.length );
bpattern.copy( data, ( bpattern.length * 2 ) );
log( '- parse data for patterns and get results' );
var qap = QuickParser( bpattern ),
    results = qap.parse( data );

log( '- check if the parse method returns exactly 3 results' );
assert.equal( results.length, 3, 'results length is wrong, must be 3, now it\'s ' + results.length );
assert.deepEqual( results, [ 20, 30, 40 ], 'results don\'t match' );
/**/