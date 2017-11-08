/*
* @Author: 10261
* @Date:   2017-11-08 10:10:44
* @Last Modified by:   10261
* @Last Modified time: 2017-11-08 11:36:22
*/
var gulp = require('gulp');
var runSequence = require('run-sequence');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('mainJs', function () {
	return gulp.src('public/js/*.js')
	           .pipe(concat('main.js'))
	           .pipe(uglify())
	           .pipe(gulp.dest('./public/'));
});
gulp.task('revJs', function () {
	return gulp.src('./public/main.js')
	           .pipe(rev())
	           .pipe(gulp.dest('./public/'))
	           .pipe(rev.manifest())
	           .pipe(gulp.dest('./public/'));
})
gulp.task('replace', function () {
	return gulp.src(['./public/*.json', './public/index.html'])
	           .pipe(revCollector())
	           .pipe(gulp.dest('./public/'));
});
gulp.task('dev', function (done) {
	condition = false;
	runSequence(['mainJs'], ['revJs'], ['replace'], done);
});

