var gulp = require( 'gulp' );
var compiler = require( 'tsify' );
var source = require( 'vinyl-source-stream' );
var browserify = require( 'browserify' );
var watchify = require( 'watchify' );
var buffer = require( 'vinyl-buffer' );
var uglify = require( 'gulp-uglify' );
var gutil = require( 'gulp-util' );
var sourcemaps = require( 'gulp-sourcemaps' );
var paths = {
	pages : [ 'src/*.html' ],
	css : [ 'src/css/*.css' ]
};

gulp.task("copyHTML",function(){
	return gulp.src(paths.pages)
	.pipe(gulp.dest("dist"));
});

gulp.task("copyCss",function(){
	return gulp.src(paths.css)
	.pipe(gulp.dest("dist/css"));
});

var browserifed = browserify({
	basedir : '.',
	debug : true,
	entries : ['src/main.ts'],
	cache : {},
	packageCache : {}
})
.plugin(compiler);

var watchedBrowserify = watchify(browserifed);

var bundled = function(){
	return watchedBrowserify
			.bundle()
			.pipe(source('bundle.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write("./"))
			.pipe(gulp.dest("dist"));
};


gulp.task("default",["copyHTML", "copyCss"], bundled);
watchedBrowserify.on("update", bundled );
watchedBrowserify.on("log", gutil.log);
