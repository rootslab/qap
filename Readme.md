###QuickParser 
[![build status](https://secure.travis-ci.org/rootslab/qap.png?branch=master)](http://travis-ci.org/rootslab/qap)
 * Qap is a quick parser for string or buffer patterns. 
 * It is optimized for using with pattern strings <= 255 bytes.
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

####Benchmark for a small pattern ( length <= 255 bytes )

> Parser uses a Buffer 256-bytes long to build the shifting table, then:

> - Pattern parsing / table creation space and time complexity is O(σ).
> - Very low memory footprint.
> - Ultra fast to preprocess pattern ( = table creation ).

```bash
  $ node bench/small-pattern-data-rate
```

for default it:

> - uses a pattern string of 57 bytes/chars
> - builds a data buffer of 700 MB in memory
> - uses a redundancy/distance factor for pattern strings equal to 2. The bigger the value, 
the lesser are occurrences of pattern string into the text buffer.

 **Custom Usage**:

```bash
  # with [testBufferSizeInMB] [distanceFactor] [aStringPattern]
  $ node bench/small-pattern-data-rate.js 700 4 "that'sallfolks"
```

####Benchmark for a big pattern ( length > 255 bytes )

> Parser uses one Array to build the shifting table for a big pattern, then:

> - table has a size of 256 elements, every element is an integer value that
> could be between 0 and the pattern length.
> - Fast to preprocess pattern ( = table creation ).
> - Low memory footprint

```bash
  $ node bench/big-pattern-data-rate
```

> - it uses a pattern size of 20MB
> - builds a data buffer of 300MB copying pattern 12 times

See [bench](https://github.com/rootslab/qap/tree/master/bench) dir.