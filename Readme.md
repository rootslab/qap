###Quick ASCII Parser 
[![build status](https://secure.travis-ci.org/rootslab/qap.png)](http://travis-ci.org/rootslab/qap)
 * Qap is a fast parser for ASCII string patterns.
 * Better results are achieved with long and sparse patterns.
 * It is an implementation of QuickSearch algorithm :
 * http://www-igm.univ-mlv.fr/~lecroq/string/node19.html#SECTION00190

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

> Create an instance with a Buffer or String. 

```javascript
Qap( String pattern )
Qap( Buffer pattern )
```

> List all pattern occurrences into a String or Buffer data.
> It returns an array of indexes.

```javascript
Qap.parse( String data, [ Number startFromIndex ], [ Number limitResultsTo ] ) : []
Qap.parse( Buffer data, [ Number startFromIndex ], [ Number limitResultsTo ] ) : []
```

> Change the pattern with a Buffer or String

```javascript
Qap.setPattern( String anotherPattern )
Qap.setPattern( Buffer anotherPattern )
```

###Usage Example

```javascript
var assert = require( 'assert' ),
    QuickAsciiParser = require( './qap' ).QuickAsciiParser, // or Qap
    pattern = 'hellofolks\r\n\r\n',
    text = 'hehe' + pattern +'loremipsumhellofolks\r\n' + pattern;

// create a Qap instance that parses the pattern
var qap = QuickAsciiParser( pattern ),
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

### Data Rate Simple Benchmark

```bash
  $ node bench/data-rate
```
for default :

> - uses a pattern string of 57 bytes/chars (ascii)
> - builds a data buffer of 700 MB in memory
> - uses a redundancy factor for pattern strings. The bigger the value, 
the lesser are occurrences of pattern string into the text buffer. ( range: [1,5] )

 **Custom Usage**:

```bash
  // with [NumberOfMegaBytes] [GapFactor] [patternString]
  $ node bench/data-rate.js 700 4 "that'sallfolks"
```

