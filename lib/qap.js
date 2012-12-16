/*
 * Qap is a quick parser for string or buffer patterns.
 * It is optimized for using with pattern strings/buffers <= 255 chars/bytes.
 * Better results are achieved with sparse and long patterns in the data to be parsed.
 * It is an implementation of QuickSearch algorithm :
 * http://www-igm.univ-mlv.fr/~lecroq/string/node19.html#SECTION00190
 * Copyright(c) 2011 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Qap = exports.QuickParser = ( function () {
    'use strict';
    var log = console.log,
        // shifting table
        _lookupTable = function ( p ) {
            var m = p.length,
                t = ( m > 255 ) ? [] : new Buffer( 256 ),
                i = 255,
                j = 0;
            for ( ; i >= 0 ; t[ i ] = 0, i-- );
            for ( ; m > 0; t[ p[ j++ ] ] = m-- );
            return t;
        },
        lookupTable = function ( p ) {
            var m = p.length,
                // shift bits
                wfn = 'writeUInt16BE',
                i = 512,
                t = new Buffer( i ),
                j = 0;
            // reset buffer;
            for ( ; ~i; t[ --i ] = 0 );
            for ( ; m > 0; ++j, --m ) {
                t[ wfn ]( m, ( p[ j ] << 1 ) );
            }
            return t;
        },
        __lookupTable = function ( p ) {
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
        },
        // error messages
        etmsg = 'the argument type should be Buffer or String, now it\'s ',
        // parser
        QuickParser = function ( pattern ) {
            var me = this;
            if ( ! ( me instanceof QuickParser ) ) {
                return new QuickParser( pattern );
            }
            me.setPattern = function ( p ) {
                if ( ! Buffer.isBuffer( p ) ) {
                    var ptype = ( typeof p );
                    if ( ptype === 'string' ) {
                        p = new Buffer( p );
                    } else {
                        throw new Error( etmsg + '"' + ptype +'"' );
                        // or p.toString();
                    }
                }
                me.p = p;
                me.plkb = lookupTable( p );
            };
            me.setPattern( pattern );
        },
        qaproto = QuickParser.prototype;

    qaproto.parse = function ( data, start, rlimit, array ) {
        if ( ! Buffer.isBuffer( data ) ) {
            var dtype = ( typeof data );
            if ( dtype === 'string' ) {
                // obviously it's slow
                data = new Buffer( data );
            } else {
                throw new Error( etmsg + '"' + dtype +'"' );
                // or data.toString();
            }
        }
        var me = this,
            p = me.p,
            m = p.length,
            plkb = me.plkb,
            n = data.length,
            indexes = Array.isArray( array ) ? array : [],
            j = start || 0,
            ok = 1,
            z = 0,
            x = p[ 0 ],
            pos = 0 + j,
            y = data[ pos ],
            i = m + j,
            c = data[ i ],
            rc = c * 4,
            offset = n - m,
            l = rlimit || Infinity;
        for ( ; j <= offset;
                i = j + m,
                c = data[ i ],
                z = 0,
                ok = 1,
                pos = j,
                x = p[ 0 ],
                y = data[ pos ] ) {
            for ( ; z < m ;
                    z++,
                    pos++,
                    x = p[ z ],
                    y = data[ pos ] ) {
                if ( x === y ) { continue; }
                else { ok = 0; break; }
            }
            // if ( ok && ( indexes.push( j, pos ) >= l ) ) {
            if ( ok && ( indexes.push( j ) >= l ) ) {
                break;
            }
            /** /
            j += plkb[ c ] || m + 1;
            /** /
            // 32 bits
            rc = c * 4;
            j += ( ( plkb[ rc ] * 16777216 ) +
                 ( plkb[ rc + 1 ] * 65536 ) +
                 ( plkb[ rc + 2 ] * 256 ) +
                  plkb[ rc + 3 ] ) || m + 1;
            /**/
            /**/
            // 16 bits
            rc = c * 2;
            j += ( ( plkb[ rc ] * 256 ) +
                  plkb[ rc + 1 ] ) || m + 1;
            /**/
        }
        return indexes;
    };
    return QuickParser;
} )();