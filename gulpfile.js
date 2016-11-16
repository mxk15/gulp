//cnpm install --save-dev gulp
var gulp = require('gulp');
//压缩js文件；cnpm install --save-dev gulp-uglify
var uglify = require('gulp-uglify');
//合并  cnpm install --save-dev gulp-concat
var concat = require('gulp-concat');
//删除   cnpm install --save del
var del = require('del');
//重命名
var rename = require('gulp-rename');
//打印JS报告  cnpm install jshint gulp-jshint --save-dev
var jshint = require('gulp-jshint');
//打印报告样式  cnpm install --save-dev jshint-stylish
var jshintStylish = require('jshint-stylish');
//自定义报告  cnpm install --save-dev map-stream
var map = require('map-stream');
//图片压缩 cnpm install --save-dev gulp-inagemin;
var imagemin = require('gulp-imagemin');
//css压缩 npm install gulp-clean-css --save-dev
var cleanCss = require('gulp-clean-css');
//生产map文件
var sourcemaps = require('gulp-sourcemaps');
//自定义jshint报错格式
var customeReporter = map(function(file,cb){
	
	//如果出现错误
	if(!file.jshint.success){
		console.log('这个文件'+ file.path+'jshint 代码检验未通过');
		//遍历错误报告
		file.jshint.results.forEach(function(err){
			if(err){
				console.log("在" + file.path +' 文件的第'+ err.error.line +'行,第'+err.error.character+'列的代码'+
					err.error.code + "发生了" + err.error.reason + '错误'
					);
			}
		});
	}
	//必需
	cb(null,file);
});

gulp.task('compress-images',function(){
	gulp.src('mmbox/images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('m-images'))
});

gulp.task('styles',function(){
	gulp.src('mmbox/css/*.css')
		.pipe(sourcemaps.init())
		.pipe(cleanCss({compatibility:'ie8'}))
		.pipe(sourcemaps.write('../mapCSS'))
		.pipe(gulp.dest('dist/css'))
});

gulp.task('clean',function(){
	console.log('开始删除');
	return del('dist/**/*.js');
});

gulp.task('jshints',['clean'],function(){
	console.log('检测js代码..');
	gulp.src('mmbox/js/loupe.js')
	.pipe(jshint())
	// .pipe(jshint.reporter('default'))//(默认)
	//.pipe(jshint.reporter(jshintStylish))
	.pipe(customeReporter)
});

gulp.task('scripts',function(){
	console.log('压缩合并js文件');
	gulp.src("mmbox/js/*.js")
	.pipe(sourcemaps.init())
	.pipe(uglify())
	.pipe(concat('all.js'))
	.pipe(rename('all.min.js'))
	.pipe(sourcemaps.write('../mapJS'))
	.pipe(gulp.dest('dist/js'));
});

gulp.task('default',function(){
	console.log('开始构建项目..');
});