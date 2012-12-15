###QuickParser 
[![build status](https://secure.travis-ci.org/rootslab/qap.png)](http://travis-ci.org/rootslab/qap)
 * Qap is a quick parser for string or buffer patterns. 
 * It is optimized for using with pattern strings <= 255 chars/bytes.
 * Better results are achieved with long and sparse patterns.
 * It is an implementation of QuickSearch algorithm.

###Main features

> Given a m-length pattern and n-length data and σ-length alphabet ( σ = 256 ):

 - simplification of the Boyer-Moore algorithm ( *see [Bop](https://github.com/rootslab/bop)* ).
 - uses only a bad-character shift table.
 - preprocessing phase in __O(m+σ)__ time and __O(σ)__ space complexity.
 - searching phase in __O(m*n)__ time complexity.
 - very fast in practice for short patterns and large alphabets.

> See [Lecroq](http://www-igm.univ-mlv.fr/~lecroq/string/node19.html) for reference.


###Install
```bash
$ npm install qap [-g]
```
###Run Tests

```javascript
$cd qap/
$npm test
```
###Signatures

> Create an instance with a Buffer or String pattern. 

```javascript
Qap( String pattern )
Qap( Buffer pattern )
```

> List all pattern occurrences into a String or Buffer data.
> It returns a new array of indexes, or populates an array passed as the last argument to parse method.

```javascript
// slower with String
Qap#parse( String data, [ Number startFromIndex ], [ Number limitResultsTo ], [ Array array ] ) : []
// faster with Buffer
Qap#parse( Buffer data, [ Number startFromIndex ], [ Number limitResultsTo ], [ Array array ] ) : []
```

> Change the pattern with a Buffer or String

```javascript
Qap#setPattern( String anotherPattern )
Qap#setPattern( Buffer anotherPattern )
```

###Usage Example

```javascript
var assert = require( 'assert' ),
    QuickParser = require( './qap' ).QuickParser, // or Qap
    pattern = 'hellofolks\r\n\r\n',
    text = 'hehe' + pattern +'loremipsumhellofolks\r\n' + pattern;

// create a Qap instance that parses the pattern
var qap = QuickParser( pattern ),
	// parse data from beginning
	results = qap.parse( text );

// change pattern with a buffer
qap.setPattern( new Buffer( pattern ) );

// re-parse data passing a Buffer instance instead of a String
var bresults = qap.parse( new Buffer( text ) );

// results are the same
assert.deepEqual( results, bresults );

// parser results ( starting indexes ) [ 4, 40 ]
console.log( results, bresults );
```

####Benchmark for small patterns is very fast

```bash
  $ node bench/small-pattern-data-rate
```
for default :

> - uses a pattern string of 57 bytes/chars
> - builds a data buffer of 700 MB in memory
> - uses a redundancy factor for pattern strings. The bigger the value, 
the lesser are occurrences of pattern string into the text buffer. ( range: [1,5] )

 **Custom Usage**:

```bash
  // with [NumberOfMegaBytes] [GapFactor] [patternString]
  $ node bench/small-pattern-data-rate.js 700 4 "that'sallfolks"
```

####Benchmark for big patterns is very slow

```bash
  $ node bench/big-pattern-data-rate
```

> - it uses a pattern size of 20MB
> - builds a data buffer of 300MB copying pattern 12 times

See [bench](https://github.com/rootslab/qap/tree/master/bench) dir.