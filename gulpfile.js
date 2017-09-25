"use strict"

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),        // Наблюдение за изменениями файлов
    prefixer    = require('gulp-autoprefixer'), // Автоматически добавляет вендорные префиксы к CSS свойствам
    uglify      = require('gulp-uglify'),       // Сжимать наш JS
    concat      = require('gulp-concat'),       // Подключаем gulp-concat (для конкатенации файлов)
    rigger      = require('gulp-rigger'),       // Позволяет импортировать один файл в другой простой конструкцией
    sass        = require('gulp-sass'),         // для компиляции нашего SCSS кода
    sourcemaps  = require('gulp-sourcemaps'),   // Для генерации css sourscemaps, помогает нам при отладке кода
    cssmin      = require('gulp-minify-css'),   // Сжатие CSS кода
    imagemin    = require('gulp-imagemin'),     // Сжатие картинок
    pngquant    = require('imagemin-pngquant'), // Сжатие картинок | работа с PNG
    rename      = require('gulp-rename'),       // Подключаем библиотеку для переименования файлов
    cache       = require('gulp-cache'),        // Подключаем библиотеку кеширования
    //sftp        = require('gulp-sftp'),
    spritesmith = require('gulp.spritesmith'),
    plumber     = require('gulp-plumber'),      // Ловим ошибки, чтобы не прервался watch
    svgSprite   = require('gulp-svg-sprite'),
    svgmin      = require('gulp-svgmin'),
    cheerio     = require('gulp-cheerio'),
    replace     = require('gulp-replace'),
    browserSync = require("browser-sync").create();


// пути
var path = {
    build: {
        js:            'build/js/',
        styles:        'build/css/',
        images:        'build/images/',
        fonts:         'build/fonts/',
        libs:          'build/libs/',
        html:          'build/index.html'
    },
    src: {
        js:                 'src/js/*.js',
        styles:             'src/styles/*.+(sass|scss|css)',
        images:             'src/images/**/*.*',
        svg:                'src/svgIcons/*.svg',
        sprite:             'src/sprite/*.*',
        libs:               'src/libs/*.js',
        spriteTemplate:     'src/sass.template.mustache',
        svgSpriteTemplate:  'src/_sprite_template.scss',
        fonts:              'src/fonts/**/*.*',
        stylesPartials:     'src/styles/partials/'
    },
    watch: {
        sprite:        'src/sprite/*.*',
        js:            'src/js/*.js',
        styles:        'src/styles/*.+(sass|scss|css)',
        images:        'src/images/**/*.*',
        fonts:         'src/fonts/**/*.*'
    }
};

// javascript
gulp.task('js:build', function () {
    gulp.src([path.src.js])
        .pipe(plumber())
        //.pipe(sourcemaps.init()) //Инициализируем sourcemap
        //.pipe(sourcemaps.write())
        .pipe(concat('main.min.js' , {newLine: ';'}))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream())
        .pipe(plumber.stop());
        // .pipe(sftp({
        //   host: '10.10.4.3',
        //   user: 'apache',
        //   pass: 'Milan16061',
        //   remotePath: '/var/www/html/bitrix/templates/interrao-2016/js/'
        // }));
});
//libs
gulp.task('libs:build', function() {
    gulp.src([
            'src/libs/jquery.min.js',
            'src/libs/!(jquery.min).js' 
        ])
        .pipe(plumber())
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest('build/libs/')); // Выгружаем в папку app/js
        // .pipe(sftp({
        //   host: '10.10.4.3',
        //   user: 'apache',
        //   pass: 'Milan16061',
        //   remotePath: '/var/www/html/bitrix/templates/interrao-2016/libs/'
        // }));
});
// move custom fonts to build
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
    gulp.src('src/fonts/**/*.css')
    .pipe(concat('fonts.min.css'))
    .pipe(gulp.dest(path.build.styles)); // И в build
});

// imagesss
gulp.task('image:build', function () {
    gulp.src(path.src.images)
        .pipe(plumber())
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.images));
        // .pipe(sftp({
        //   host: '10.10.4.3',
        //   user: 'apache',
        //   pass: 'Milan16061',
        //   remotePath: '/var/www/html/bitrix/templates/interrao-2016/images/'
        // }));
});
// styles
gulp.task('styles:build', function () {

    gulp.src([path.src.styles])               // Выберем наш .sass|scss
        .pipe(plumber())
        //.pipe(sourcemaps.init())            // То же самое что и с js
        .pipe(sass())                       // Скомпилируем
        .pipe(prefixer(['last 15 versions', 'IE 8'], { cascade: true }))                   // Добавим вендорные префиксы
        .pipe(concat('template_styles.min.css'))
        .pipe(cssmin())
        //.pipe(sourcemaps.write())           // Пропишем карты
        .pipe(plumber.stop())
        .pipe(gulp.dest(path.build.styles)) // И в build
        .pipe(browserSync.stream());
        //.pipe(sftp({
          // host: '10.10.4.3',
          // user: 'apache',
          // pass: 'Milan16061',
          // remotePath: '/var/www/html/bitrix/templates/interrao-2016/css/'
        //}));
});

/*svg*/
gulp.task('svgSprite:build', function () {
    return gulp.src(path.src.svg)
        // minify svg
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        // remove all fill, style and stroke declarations in out shapes
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[stroke]').removeAttr('stroke');
                $('[style]').removeAttr('style');
            },
            parserOptions: {xmlMode: true}
        }))
        // cheerio plugin create unnecessary string '&gt;', so replace it.
        .pipe(replace('&gt;', '>'))
        // build svg sprite
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "sprite.svg",
                    // render: {
                    //     scss: {
                    //         dest:'src/styles/other/',
                    //         template: path.src.svgSpriteTemplate
                    //     }
                    // }
                }
            }
        })) 
        .pipe(gulp.dest(path.build.images))
        .pipe(gulp.dest("src/styles/other/"));
});
gulp.task('sprite:build', function() {
    var spriteData =
        gulp.src(path.src.sprite)
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.scss',
                cssFormat: 'scss',
                algorithm: 'binary-tree',
                padding: 4,
                cssTemplate: path.src.spriteTemplate,
                cssVarMap: function(sprite) {
                    sprite.name = 's-' + sprite.name
                }
            }));
    spriteData.img.pipe(gulp.dest(path.build.images));
    spriteData.css.pipe(gulp.dest('src/styles/other'));
    // spriteData.img.pipe(sftp({
    //       host: '10.10.4.3',
    //       user: 'apache',
    //       pass: 'Milan16061',
    //       remotePath: '/var/www/html/bitrix/templates/interrao-2016/images/'
    //     }));
});
gulp.task('build', [
    'libs:build',
    'sprite:build',
    'svgSprite:build',
    'js:build',
    'fonts:build',
    'image:build',
    'styles:build'
], function(){
    browserSync.init({
        server: "./build",
        ghostMode: false
    });
});

gulp.task('watch', function(){
    gulp.watch(path.watch.js,     ['js:build']);
    gulp.watch(path.watch.styles, ['styles:build']);
    gulp.watch(path.watch.images, ['image:build']);
    gulp.watch(path.watch.fonts,  ['fonts:build']);
    gulp.watch(path.watch.sprite, ['sprite:build']);
    gulp.watch(path.watch.svg, ['svgSprite:build']);
    gulp.watch("build/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['build', 'watch']);