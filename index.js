'use strict';

var path = require('path');
var gutil = require('gulp-util');
var babylon = require('babylon');
var through2 = require('through2');

function justdoc (opts) {
	opts = opts || {};
	var babylonOpts = opts.babylon || {
		sourceType: 'module'
	};
	var docExtension = opts.extension || 'md';
	var matchRegex = opts.regexp || /^=(.*)\n/;

	var files = [];
	return through2.obj(function transform (file, enc, callback) {
		if (file && file.isBuffer()) {
			files.push(file);
		}
		callback();
	}, function flush (done) {
		var self = this;
		files.forEach(function (file) {
			var base = file.path.replace(file.relative, '');
			var relativeParsed = path.parse(file.relative);
			var relative = path.join(relativeParsed.dir, relativeParsed.name + '.' + docExtension);
			var parsedFile = babylon.parse(file.contents.toString('utf8'), babylonOpts);

			var contents = parsedFile.comments.reduce(function (markdownDoc, comment) {
				var match = matchRegex.exec(comment.value);
				if (match) {
					var docmarkComment = comment.value.replace(matchRegex, '');
					var leading = match[1];
					if (leading !== undefined && leading.length > 0) {
						return markdownDoc.concat(docmarkComment.split(/\n/).map(function (docmarkLine) {
							return docmarkLine.replace(leading, '');
						}).join('\n') + '\n');
					}
					return markdownDoc.concat(docmarkComment + '\n');
				}
				return markdownDoc;
			}, '');

			self.push(new gutil.File({
				base: base,
				path: path.join(base, relative),
				contents: new Buffer(contents, 'utf8')
			}));
		});
		done();
	});
}

module.exports = justdoc;
