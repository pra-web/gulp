var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    imageop = require('gulp-image-optimization'),
    less = require('gulp-less'),
    sprite = require('gulp.spritesmith'),
    concat = require('gulp-concat-css'),
    autoprefixer = require('gulp-autoprefixer');

//Запускает локальный сервер в реальном времени
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});


//Сжатие картинок, запускается отдельно в консоли (gulp images)
gulp.task('images', function (cb) {
    gulp.src(['app/theme/images/**/*.png', 'app/theme/images/**/*.jpg', 'app/theme/images/**/*.gif', 'app/theme/images/**/*.jpeg']).pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('app/theme/images')).on('end', cb).on('error', cb);
});
gulp.task('sprite', function () {
    var spriteData = gulp.src('app/theme/images/sprite/*.*').pipe(sprite({
        imgName: 'sprite.png',
        cssName: 'sprite.less',
        imgPath: '../images/sprite.png',
        padding: 1
    }));
    spriteData.img.pipe(gulp.dest('app/theme/images/'));
    spriteData.css.pipe(gulp.dest('app/theme/less/'));

});

gulp.task('less', function () {
    gulp.src('app/theme/less/**/*.less')
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
            browsers: ['last 12 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/theme/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function () {
    gulp.src('app/**/*.html')
        .pipe(browserSync.reload({
            stream: true
        }));
});



//Отслеживает изменение в файлах и запускает необходимое функцию
gulp.task('watch', function () {
    gulp.run('less', 'html', 'browser-sync', 'sprite'); //запуск функций

    gulp.watch('app/theme/less/**/*.less', function (event) {
        gulp.run('less');
    });
    gulp.watch('app/theme/images/sprite/*.*', function (event) {
        gulp.run('sprite');
    });

    gulp.watch('app/**/*.html', function (event) {
        gulp.run('html');
    });
});