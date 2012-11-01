/*
 * Qap is a quick parser for string patterns.
 * Better results are achieved with sparse and long patterns in the data to be parsed.
 * It is an implementation of QuickSearch algorithm :
 * http://www-igm.univ-mlv.fr/~lecroq/string/node19.html#SECTION00190
 * Copyright(c) 2011 Guglielmo Ferri <44gatti@gmail.com>
 * MIT Licensed
 */

exports.version = require( '../package' ).version;
exports.Qap = exports.QuickParser = ( function () {
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
                me.plen = p.length;
                me.plkb = lookupTable( p );
            };
            me.setPattern( pattern );
        },
        qaproto = QuickParser.prototype;

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
            // if ( ok && ( indexes.push( j, pos ) >= l ) ) {
            if ( ok && ( indexes.push( j ) >= l ) ) {
                break;
            }
            j += plkb[ c ] || m + 1;
        }
        return indexes;
    };
    require( 'buffer' ).INSPECT_MAX_BYTES = -1;
    return QuickParser;
} )();