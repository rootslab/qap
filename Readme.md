###Quick ASCII Parser 
 * Qap is an ASCII string parser, intended only for pattern strings with a length lesser than 255 chars/bytes.
 * Better results are achieved with sparse patterns in the data to be parsed.
 * It is an implementation of QuickSearch algorithm :
 * http://www-igm.univ-mlv.fr/~lecroq/string/node19.html#SECTION00190

###Install
```bash
$ npm install qap
```

###Usage

```javascript
var log = console.log,
    assert = require( 'assert' ),
    QuickAsciiParser = require( 'qap' ).QuickAsciiParser, // or Qap
    pattern = 'hellofolks\r\n\r\n',
    text = 'hehehellofolks\r\n\r\nloremipsumetdolorsitamethellofolks\r\nhellofolks\r\n\r\n',
    qap = new QuickAsciiParser( pattern );

var results = qap.parse( text );

// parser results is an array of starting indexes [ 4, 54 ]
log( results );

// use qap with a raw buffer
qap.setPattern( new Buffer( pattern ) );
var bresults = qap.parse( new Buffer( data ) );
assert.deepEqual( results, bresults );
```
-------------

###Tests

```javascript
$npm test
```

-------------

### Data Rate Benchmark

```bash
  $ node bench/data-rate
```
for default :

> - uses a pattern string of 57 bytes/chars (ascii)
> - builds a data buffer of 900 MB in memory
> - uses a redundancy factor for boundary strings. The bigger the value, 
the lesser are occurrences of boundary string into the text buffer. ( range: [1,5] )

 **Custom Usage**:

```bash    
  // with [NumberOfMegaBytes] [GapFactor] [patternString]
  $ node bench/data-rate.js 700 4 "that'sallfolks"
```

