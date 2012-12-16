var log = ( !! true ) ? console.log : function () {},
    assert = require( 'assert' ),
    t = require( './tables' ),
    // stuff
    kb = 32,
    msg = log( '- building and pre-processing a %dKB pattern..', kb ),
    smem = process.memoryUsage(),
    bp = new Buffer( 1024 * kb ),
    emem0 = process.memoryUsage(),
    bc = t.lookupTable( bp ),
    emem1 = process.memoryUsage(),
    bc16 = t.bcTable16( bp ),
    emem2 = process.memoryUsage(),
    bc32 = t.bcTable32( bp ),
    emem3 = process.memoryUsage(),
    // output results
    output = function ( n, e, s, t ) {
        log( '- %s length is %s', n, t );
        log( '- %s mem usage is %d KBytes', n, ( ( e.rss - s.rss ) / 1024 ).toFixed( 1 ) );
        log( '- %s avg mem usage per pattern element is %d bytes', n, ( ( e.rss - s.rss ) / t ).toFixed( 1 ) );
    };

// output( '[bc]', emem1, emem0, bp.length );
// output( '[bc]', emem1, emem0, bp.length );

/** /
for ( var i = 0; i < 256; ++i ) {
    // log( i, i << 2 >>> 0 )
    assert.equal( bc[ i ], bc32.readUInt32BE( ( i << 2 ) >>> 0 ) );
}
log( '- tables compared, results match!' );

/**/
var i = 0,
    k = 0,
    K = 1024,
    stime = Date.now();
/** /
for ( ; k < K; ++k ) {
    stime = Date.now();
    i = 0;

    for ( ; i < bc.length; ++i ) {
        // log( i, i << 2 >>> 0 )
        bc[ i ];
    }
}

log( Date.now() - stime );

k = 0;
stime = Date.now();
for ( ; k < K; ++k ) {
    i = 0;
    for ( ; i < 256; ++i ) {
        // log( i, i << 2 >>> 0 )
        bc32.readUInt32BE( ( i << 2 ) >>> 0 );
    }
}

log( Date.now() - stime );


/** /
// 32 bits


bc32[ 0 ] = 214;
bc32[ 1 ] = 114;
bc32[ 2 ] = 84;
bc32[ 3 ] = 24;
/** /
log( ( bc32[ 0 ] * 65536 * 256 ) + ( bc32[ 1 ] * 65536 ) + ( bc32[ 2 ] * 256 ) + bc32[ 3 ] );
log( bc32[ 0 ], bc32[ 1 ], bc32[ 2 ], bc32[ 3 ] )
log( bc32.readUInt32BE( 0 ) );
/** /

k = 0;
stime = Date.now();
var s = 0,
    num = -1,
    num2 = -1;
for ( ; k < K; ++k ) {
    i = 0;
    for ( ; i < 1024; i += 4 ) {
        // log( i, i << 2 >>> 0 )
        s = i; //( i << 2 ) >>> 0;
        num = ( bc32[ s ] * 16777216 ) + ( bc32[ s + 1 ] * 65536 ) + ( bc32[ s + 2 ] * 256 ) + bc32[ s + 3 ];
        // num2 = bc32.readUInt32BE( s );
        // log( num, num2 );
    }
}

log( Date.now() - stime );

k = 0;
stime = Date.now();
var s = 0,
    num = -1,
    num2 = -1;
for ( ; k < K; ++k ) {
    i = 0;
    for ( ; i < 1024; i += 4 ) {
        // log( i, i << 2 >>> 0 )
        s = i; // ( i << 2 ) >>> 0;
        num = ( bc32[ s ] << 24 >>> 0 ) + ( bc32[ s + 1 ] << 16 ) + ( bc32[ s + 2 ] << 8 ) + bc32[ s + 3 ];
        // num2 = bc32.readUInt32BE( s );
        // log( num, num2 );
    }
}

log( Date.now() - stime );
/**/

// 16 bits

k = 0;
stime = Date.now();
var s = 0,
    num = -1,
    num2 = -1;
for ( ; k < K; ++k ) {
    i = 0;
    for ( ; i < 512; i += 2 ) {
        s = i;
        num = ( bc16[ s ] * 256 ) + bc16[ s + 1 ];
        // num2 = bc16.readUInt16BE( s );
        // log( num, num2 );
    }
}

log( Date.now() - stime );

k = 0;
stime = Date.now();
var s = 0,
    num = -1,
    num2 = -1;
for ( ; k < K; ++k ) {
    i = 0;
    for ( ; i < 512; i += 2 ) {
        s = i;
        num = ( bc16[ s ] << 8 ) + bc16[ s + 1 ];
        // num2 = bc16.readUInt16BE( s );
        // log( num, num2 );
    }
}

log( Date.now() - stime );
