/** /
// TODO, dummy test for the "double memory" version
var log = console.log,
    assert = require( 'assert' ),
    QuickAsciiParser = require( '../' ).Qap,
    pattern = 'bacicc\r\n\r\n',
    data = 'ambara' + pattern + 'icocco\r\n\r\tregallinesulcom' + pattern + 'obacicc\r\n\ri',
    qap = new QuickAsciiParser( pattern ),
    results = qap.parse( data );

log( '- input data was parsed, length: ' + data.length, 'bytes' );
log( '- pattern length:', pattern.length, 'bytes' );
log( '- resulting indexes:', results );
log( '- now running dummy tests..' );

assert.equal( results.length, 4 );
assert.equal( results.length & 1, 0 );
assert.equal( results[ 0 ], 6 );
assert.equal( results[ 1 ], 6 + pattern.length );
assert.equal( results[ 2 ], 41 );
assert.equal( results[ 3 ], 41 + pattern.length );
assert.equal( data.slice( results[ 0 ], results[ 1 ] ) + '', pattern );
assert.equal( data.slice( results[ 2 ], results[ 3 ] ) + '', pattern );

// change pattern to Buffer type
qap.setPattern( new Buffer( pattern ) );
var bresults = qap.parse( new Buffer( data ) );
assert.deepEqual( results, bresults );

log( '- all tests passed!\n' );
/**/
