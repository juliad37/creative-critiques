const gulp = require('gulp');
const babel = require(`gulp-babel`);
const cssCompressor = require('gulp-csso');
const browserSpecificPrefixer = require(`gulp-autoprefixer`);
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const jsCompressor = require('gulp-uglify');
const imageCompressor = require(`gulp-imagemin`);
const htmlMinifier = require(`gulp-htmlmin`);
const browserSync = require(`browser-sync`);
const htmlValidator = require(`gulp-html`);
const jsLinter = require(`gulp-eslint`);
const reload = browserSync.reload;
const browserChoice = `google chrome`;


//gulp.task('sass', function(){
  //  return gulp.src('dev/styles/main.scss')
    //    .pipe(sass())
      //  .pipe(cssnano())
  //      .pipe(gulp.dest('./prod/css'));
//});


gulp.task('sass', function () {
    return gulp.src('app/styles/main.scss')
        .pipe(sass({outputStyle: 'compressed', precision: 10
        }).on('error', sass.logError))
});


gulp.task(`compileCSSForProd`, function () {
    return gulp.src(`app/styles/main.scss`)
        .pipe(sass({
            outputStyle: `compressed`,
            precision: 10
        }).on(`error`, sass.logError))
        .pipe(browserSpecificPrefixer({
            browsers: [`last 2 versions`]
        }))
        .pipe(cssCompressor())
        .pipe(gulp.dest(`prod/styles`));
});


gulp.task(`transpileJSForProd`, function () {
    return gulp.src(`app/scripts/*.js`)
        .pipe(babel())
        .pipe(jsCompressor())
        .pipe(gulp.dest(`prod/scripts`));
});






gulp.task(`validateHTML`, function () {
    return gulp.src([`app/html/*.html`, `app/html/**/*.html`])
        .pipe(htmlValidator());
});


gulp.task('js', function(){
    return gulp.src(['app/scripts/js/plugins/*.js', 'app/scripts/js/*.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js'));
});


gulp.task(`lintJS`, function () {
    return gulp.src(`app/scripts/*.js`)
        .pipe(jsLinter({
            rules: {
                indent: [2, 4, {SwitchCase: 1}],
                quotes: [2, `backtick`],
                semi: [2, `always`],
                'linebreak-style': [2, `unix`],
                'max-len': [1, 85, 4]
            },
            env: {
                es6: true,
                node: true,
                browser: true
            },
            extends: `eslint:recommended`
        }))
        .pipe(jsLinter.formatEach(`compact`, process.stderr));
});

gulp.task(`compressHTML`, function () {
    return gulp.src([`app/html/*.html`, `app/html/**/*.html`])
        .pipe(htmlMinifier({
            removeComments: true,
            collapseWhitespace: true
        }))
        .pipe(gulp.dest(`prod/compressed-html`));
});



gulp.task(`compressThenCopyImagesToProdFolder`, function () {
    return gulp.src(`app/img/**/*`)
        .pipe(imageCompressor({
                optimizationLevel: 3, // For PNG files. Accepts 0 – 7; 3 is default.
                progressive: true,    // For JPG files.
                multipass: false,     // For SVG files. Set to true for compression.
                interlaced: false     // For GIF files. Set to true for compression.
            }))
        .pipe(gulp.dest(`prod/img`));
});





gulp.task(`dev`, gulp.parallel(`lintJS`, `validateHTML`, `sass`), function () {
    browserSync({
        notify: true,
        port: 9000,
        //reloadDelay: 100,
        browser: browserChoice,
        server: {
            baseDir: [
                `app`,
                `app/html`
            ]
        }
    });
});


gulp.task(`build`, gulp.parallel(`lintJS`, `validateHTML`, `sass`), function () {
    browserSync({
        notify: true,
        port: 9000,
        //reloadDelay: 100,
        Browserslist: browserChoice,
        server: {
            baseDir: [
                `prod`,
                `prod/html`
            ]
        }
    });
});



gulp.task(`build`, gulp.parallel(`compressHTML`, `compileCSSForProd`, `transpileJSForProd`, `sass`, `compressThenCopyImagesToProdFolder`), function () {

});









