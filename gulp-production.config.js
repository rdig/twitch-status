var gulp = require('gulp');
var del = require('del');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');

var config = {
	paths: {
		src: {
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

// Process javascript libraries task
gulp.task('Process JS libraries', ['Cleanup'], function() {
	gulp.src(config.paths.src.js.libs)
		.pipe(gulp.dest(config.paths.dest.js.libs));
});

// Transpile the main scripts via babel / ES2015
// Info: https://www.npmjs.com/package/gulp-babel
// Info: https://github.com/terinjokes/gulp-uglify
gulp.task('Transpile JS', ['Cleanup'], function() {
	gulp.src(config.paths.src.js.scripts)
		.pipe(babel({ presets: ['es2015'] }))
		.on('error', console.error.bind(console))
		.pipe(uglify({ mangle: true }))
		.pipe(gulp.dest(config.paths.dest.js.scripts));
});

// Process all the images, basically just move them, as for this project we are using
// already compressed svgz images, there is no need to do anything to them
gulp.task('Process Media', ['Cleanup'], function() {
	// filter images / media files so we don't process anything else that might end
	// up in the media folder, although it shoudn't
	var filteredMediaFiles = ['ico', 'gif', 'jpg', 'jpeg', 'png', 'svg', 'svgz'].map(function(ext) {
		return config.paths.src.media + '.' + ext;
	});
	gulp.src(filteredMediaFiles).pipe(gulp.dest(config.paths.dest.media));
});

// Preprocess the SCSS stylesheets
// Info: https://www.npmjs.com/package/gulp-sass
gulp.task('Preprocess SCSS', ['Cleanup'], function() {
	// Files like _*.scss are auto filtered by the node-sass pipe.
	gulp.src(config.paths.src.scss)
		.pipe(sass({ outputStyle: 'compressed' }))
		.on('error', sass.logError)
		.pipe(gulp.dest(config.paths.dest.scss));
});

// Default task
gulp.task(
	'default',
	[
		'Process JS libraries',
		'Transpile JS',
		'Process Media',
		'Preprocess SCSS',
	],
	function() {
		console.log('\n');
		console.log('Production build completed successfully');
		console.log('\n');
	}
);
