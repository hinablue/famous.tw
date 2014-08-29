var EXPRESS_PORT = 4000;
var EXPRESS_ROOT = __dirname + '/app';
var LIVERELOAD_PORT = 35730;

// Load plugins
var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	lr = require('tiny-lr'),
	server = lr();

// Watch
gulp.task('watch', function(event) {
	server.listen(LIVERELOAD_PORT, function(err) {
		if(err) {
			return console.log(err)
		}

		// Watch .js files
		gulp.watch([
				'app/*'
			]
		).on('change',
			function(file) {
				server.changed(file.path);
			}
		);
	});
});

// Default task
gulp.task('default', function() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static(EXPRESS_ROOT));
	app.listen(EXPRESS_PORT);
	console.log ("Server listening on port "+EXPRESS_PORT+ ". Open http://localhost:"+EXPRESS_PORT+" in your browser.");
	gulp.start('watch');
});
