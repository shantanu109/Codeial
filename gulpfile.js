const gulp = require('gulp');

//Convert scss to css
const sass = require('gulp-sass');

//Compress the css file
const cssnano = require('gulp-cssnano');

//Library which will rename the file with a hash alongside them, home.css -> home-___.css
//Whenever it is send again to the browser, it will act as a new asset for the browser
const rev = require('gulp-rev');

//Used to minify the JavaScript
const uglify = require('gulp-uglify-es').default;

const imagemin = require('gulp-imagemin');

//Deletes files and directories

const del = require('del');

gulp.task('css', function(done){
    //pipe is a function which is calling all these sub middlewares which are in the gulp
    console.log('minifying css....');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    //Minification is DONE

    //Changing the naming convention

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        //If a name already exists, it will merge it with the previous file
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();

});


gulp.task('js', function(done){

    console.log('minifying js....');

    //Minidied the JS -> Revised the name -> Put it into public/assets -> Put the details into manifest
    
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();

});


gulp.task('images', function(done){
    console.log('compressing images....');

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();

});

//Empty the public/assets directory
//Whenever you are creating a project, you need to clear the previous build and build it from scratch

gulp.task('clean:assets', function(done){
    del.sync('./public/assets');
    done();
});


gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){

    console.log('Building assets');
    done();
})
