var BufferStream = require('bufferstream');
var colors = require('colors');
var fs = require('fs');

var request_regex = /WARC-Type: request\s+?(.+)/g
var response_regex = /WARC-Type: response\s+?(.+)/g

var warcfile = process.argv[2];
var warcstream = fs.createReadStream(warcfile);
var splitstream = new BufferStream({size: 'flexible'});

function parse_chunk(chunk) {
	if (chunk.match(request_regex)) {
		console.log('REQUEST: '.yellow, chunk);
	}
	else if (chunk.match(response_regex)) {
		console.log('RESPONSE: '.green, parse_response(chunk));
	} else {
		console.log('OTHER: '.red, chunk);
	}}

function parse_response(resp_chunk) {
	var length = parseInt(resp_chunk.match(/Content-Length: (\d+)/)[1]) || 0;
	var content = resp_chunk.slice(resp_chunk.match(/HTTP/).index) || "";
	return( { uri: resp_chunk.match(/WARC-Target-URI: (.+)/)[1],
		length: length,
		content: content } ); }


splitstream.split('WARC/1.0', function(chunk, token) {
	parse_chunk(chunk.utf8Slice());});

warcstream.pipe(splitstream);
