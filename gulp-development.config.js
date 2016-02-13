var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var eslint = require('gulp-eslint');

var config = {
	// Port number under 1024 on linux requires root privileges
	port: 8080,
	url: 'http://localhost',
	paths: {
		src: {
			html: './*.html',
			js: {
				libs: './sources/scripts/lib/*.js',
				scripts: './sources/scripts/*.js'
			},
			media: './sources/media/**/*',
			scss: './sources/styles/**/*.scss'
		},
		dest: {
			js: {
				libs: './scripts/lib',
				scripts: './scripts'
			},
			media: './media',
			scss: './styles'
		}
	}
};

// Clean the folders so we start fresh!
// Info: https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md
gulp.task('Cleanup', function() {
	return del([
		'./scripts/**/*',
		'./styles/**/*',
		'./media/**/*'
	]);
});

// Server task
gulp.task('Local web server', ['Cleanup'], function() {
	connect.server({
		root: ['./'],
		port: config.port,
		base: config.url,
		livereload: true
	});
});

// Process javascript libraries task
gulp.task('Process JS libraries', function() {
	gulp.src(config.paths.src.js.libs)
		.pipe(gulp.dest(config.paths.dest.js.libs))
		.pipe(connect.reload());
});

// Transpile the main scripts via babel / ES2015
// Info: https://www.npmjs.com/package/gulp-babel
gulp.task('Transpile JS', function() {
	gulp.src(config.paths.src.js.scripts)
		.pipe(babel({ presets: ['es2015'] }))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest(config.paths.dest.js.scripts))
		.pipe(connect.reload());
});

// Lint the JS files. Rules -> eslint-rules.json
gulp.task('Lint JS', function() {
	gulp.src(config.paths.src.js.scripts)
		.pipe(eslint({ config: 'eslint-rules.json'}))
		.pipe(eslint.format())
		.pipe(connect.reload());
});

// Process all the images, basically just move them, as for this project we are using
// already compressed svgz images, there is no need to do anything to them
gulp.task('Process Media', function() {
	// filter images / media files so we don't process anything else that might end
	// up in the media folder, although it shoudn't
	var filteredMediaFiles = ['ico', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'svgz'].map(function(ext) {
		return config.paths.src.media + '.' + ext;
	});
	gulp.src(filteredMediaFiles).pipe(gulp.dest(config.paths.dest.media)).pipe(connect.reload());
});

// Preprocess the SCSS stylesheets
// Info: https://www.npmjs.com/package/gulp-sass
gulp.task('Preprocess SCSS', function() {
	// Files like _*.scss are auto filtered by the node-sass pipe.
	gulp.src(config.paths.src.scss)
		.pipe(sass())
		.on('error', sass.logError)
		.pipe(gulp.dest(config.paths.dest.scss))
		.pipe(connect.reload());
});

// Watch for changes
gulp.task('File watcher', function() {
	gulp.watch(config.paths.src.html, ['Process JS libraries', 'Transpile JS', 'Lint JS', 'Process Media', 'Preprocess SCSS']);
	gulp.watch(config.paths.src.js.libs, ['Process JS libraries']);
	gulp.watch(config.paths.src.js.scripts, ['Transpile JS', 'Lint JS']);
	gulp.watch(config.paths.src.media, ['Process Media']);
	gulp.watch(config.paths.src.scss, ['Preprocess SCSS']);
});

// Default task
gulp.task(
	'default',
	[
		'Process JS libraries',
		'Transpile JS',
		'Lint JS',
		'Process Media',
		'Preprocess SCSS',
		'Local web server',
		'File watcher'
	]
);
