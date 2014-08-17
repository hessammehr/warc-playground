var BufferStream = require('bufferstream');
var fs = require('fs');

var warcfile = process.argv[2];
var warcstream = fs.createReadStream(warcfile);
var splitstream = new BufferStream({size: 'flexible'});

splitstream.split('WARC/1.0', function(chunk, token) {
	console.log('chunk:\n', chunk.utf8Slice());});

warcstream.pipe(splitstream);
