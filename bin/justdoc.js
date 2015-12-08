#!/usr/bin/env node

'use strict';

var justdoc = require('../index.js');
var program = require('commander');
var gulp = require('gulp');
var path = require('path');

program
	.version('1.0.0')
	.usage('[options] <SourcePath> <DestPath>')
	.description([
		'A doc gen command-line tool and library which dumps block comments in a javascript',
		'project to a docs directory of the same structure.',
		'',
		'Uses markdown file extension (.md) by default.',
	].join('\n  '))
	.option('-e, --ext <Extension>', 'file extension of doc files (default is \'md\')')
	.option('-i, --input <SourcePath>', 'path to source directory (default is current directory)')
	.option('-o, --output <DestPath>', 'path to generate new docs directory (default is \'docs\')')
	.option('-g, --glob <Glob>', 'provide custom glob (default is \'**/*.js\')');

program.parse(process.argv);

var extension = program.ext || 'md';
var glob = program.glob || path.join('**', '*.js');
var sourcePath = program.input || null;
var destPath = program.output || null;


if (program.args.length === 1) {
	if (sourcePath) {
		destPath = destPath || program.args[0];
	} else if (destPath) {
		sourcePath = sourcePath || program.args[0];
	} else {
		sourcePath = sourcePath || program.args[0];
		destPath = destPath || 'docs';
	}
} else if (program.args.length >= 2) {
	sourcePath = sourcePath || program.args[0];
	destPath = destPath || program.args[1];
} else {
	sourcePath = sourcePath || process.cwd();
	destPath = destPath || 'docs';
}

gulp.src(path.join(sourcePath, glob))
	.pipe(justdoc({
		extension: extension
	}))
	.pipe(gulp.dest(destPath));
