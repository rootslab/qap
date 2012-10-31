/*
 * Qap is a fast ASCII parser, intended only for using with pattern strings 
 * smaller than 255 chars/bytes.
 * Better results are achieved with sparse patterns in the data to be parsed.
 * It is an implementation of QuickSearch algorithm :
 * http://www-igm.univ-mlv.fr/~lecroq/string/node19.html#SECTION00190
 * Copyright(c) 2011 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

 /* TODO
  * end index
  * limit results
  * custom Buffer size ? utf?? chars??
  */

exports.version = require( '../package' ).version;
exports.QuickAsciiParser = ( function () {
    'use strict';
    var lookupTable = function ( p ) {
            var b = new Buffer( 255 ),
                m = p.length,
                i = 255,
                j = 0,
                c = m + 1;
            for( ; i >= 0 ; b[ i ] = 0x00, i-- );
            for( ; c > 0; b[ p[ j++ ] ] = --c );
            return b;
        },
        // error messages
        etmsg = 'the argument type should be Buffer or String, now it\'s ',
        elmsg = 'the argument length should be < 255 chars/bytes, now it\'s ',
        // parser
        QuickAsciiParser = function ( pattern ) {
            var me = this;
            if ( ! ( me instanceof QuickAsciiParser ) ) {
                return new QuickAsciiParser( pattern );
            }
            me.setPattern = function ( p ) {
                if ( p.length > 254 ) {
                    throw new Error( elmsg + p.length );
                }
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
                me.plen = p.length;
                me.plkb = lookupTable( p );
            };
            me.setPattern( pattern );
        },
        qaproto = QuickAsciiParser.prototype;

    qaproto.parse = function ( data, start, limit ) {
        if ( ! Buffer.isBuffer( data ) ) {
            var dtype = ( typeof data );
            if ( dtype === 'string' ) {
                data = new Buffer( data );
            } else {
                throw new Error( etmsg + '"' + dtype +'"' );
                // or data.toString();
            }
        }
        var me = this,
            p = me.p,
            m = me.plen,
            plkb = me.plkb,
            n = data.length,
            indexes = [],
            j = start || 0,
            ok = 1,
            z = 0,
            x = p[ 0 ],
            pos = 0 + j,
            y = data[ pos ],
            i = m + j,
            c = data[ i ],
            offset = n - m,
            l = limit || Infinity;
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
            // memory is doubled with pattern ending indexes :
            // if ( ok ) { indexes.push( j, pos ); }
            // if ( ok ) { indexes.push( j ); }
            if ( ok && ( indexes.push( j ) >= l ) ) {
                break;
            }
            j += plkb[ c ] || m + 1;
        }
        return indexes;
    };
    return QuickAsciiParser;
} )();

// shortcut
exports.Qap = exports.QuickAsciiParser;