module.exports = {
    // qap lookup table
    lookupTable : function ( p ) {
        var m = p.length,
            t = ( m > 255 ) ? [] : new Buffer( 256 ),
            i = 255,
            j = 0;
        for ( ; i >= 0 ; t[ i ] = 0, i-- );
        for ( ; m > 0; t[ p[ j++ ] ] = m-- );
        return t;
    },
    // bad char table
    bcTable : function ( p ) {
        var m = p.length,
            bc = ( m > 255 ) ? [] : new Buffer( 256 ),
            i = 0,
            blen = bc.length || m;
        for ( ; i < blen; bc[ i++ ] = m );
        for ( i = 0; i < m - 1; ++i ) {
            bc[ p[ i ] ] = m - i - 1;
        }
        return bc;
    },
    bcTable16 : function ( p ) {
        var m = p.length,
            // shift bits
            o = ( m > 256 ) ? 1 : 0,
            rfn = 'readUInt16BE',
            wfn = 'writeUInt16BE',
            s = 256,
            i = 512,
            t = new Buffer( i ),
            j = 0;
        // reset buffer;
        for ( ; ~i; t[ --i ] = 0 );
        for ( ; m > 0; ++j, --m ) {
            t[ wfn ]( m, ( p[ j ] * 2 ) );
        }
        return t;
    },
    bcTable24 : function ( p ) {
        var m = p.length,
            // shift bits
            i = 768,
            t = new Buffer( i ),
            j = 0;
        // reset buffer;
        for ( ; ~i; t[ --i ] = 0 );
        for ( ; m > 0; ++j, --m ) {
            // t.writeUInt24BE( m, p[ j ] * 3 );
        }
        return t;
    },
    bcTable32 : function ( p ) {
        var m = p.length,
            // shift bits
            o = ( m > 256 ) ? 2 : 1,
            rfn = ( o & 1 ) ? 'readUInt16BE' : 'readUInt32BE',
            wfn = ( o & 1 ) ? 'writeUInt16BE' : 'writeUInt32BE',
            s = 256,
            i = ( s << o ) >>> 0,
            t = new Buffer( i ),
            j = 0;
            // log( rfn, o)
        // reset buffer;
        for ( ; ~i; t[ --i ] = 0 );
        for ( ; m > 0; ++j, --m ) {
            // log( 'write', m, 'to', ( p[ j ] << o ) >>> 0 );
            t[ wfn ]( m, ( p[ j ] << o ) >>> 0 );
            // log( 'read', m, 'to', ( p[ j ] << o ) >>> 0 );
        }
        return t;
    }
};