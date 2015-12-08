# justdoc

A doc gen command-line tool and library which dumps block comments in a javascript project
to a docs directory of the same structure.

## Install

...as a gulp plugin:
```
$ npm install --save-dev justdoc
```


...as a command-line tool:
```
$ npm install -g justdoc
```

## How to Use

### justdoc gulp plugin

In your gulpfile

```
var justdoc = require('justdoc');

gulp.task('doc', function () {
	gulp.src('src/**/*.js')
	.pipe(justdoc())
	.pipe(gulp.dest('docs'));
});
```

### justdoc command-line

```
$ justdoc

  Usage: justdoc [options] <SourcePath> <DestPath>

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -e, --ext <Extension>     file extension of doc files (default is 'md')
    -i, --input <SourcePath>  path to source directory (default is current directory)
    -o, --output <DestPath>   path to generate new docs directory (default is 'docs')
    -g, --glob <Glob>         provide custom glob (default is '**/*.js')
```

Use the `justdoc` command to generate docs from a source path, and output them to a destination path:

```
$ justdoc ./src ./docs
```

`justdoc` assumes markdown, but you specify any extension and use whatever doc format you want:

```
$ justdoc -e txt ./src ./docs
```

### justdoc javscript block comments

`justdoc` parses your javascript source files for block comments and pulls out those that start with the equal sign `=`:

```
/*=
## function - getData()
returns the component data
*/
```

If the comment doesn't start with `=` then it won't be included in the doc output.

The first line can also be used to tell `justdoc` to ignore the beginning few character of each line. For example, if you want to start evey line with `*_`, then specify it after the `=` to make sure that `justdoc` will ignore it.

```
/*=*_
*_## function - getData()
*_returns the component data
*/
```

This pattern will work with any string of characters (even spaces and tabs). Useful for adding padding to your comments without affecting the doc output.
