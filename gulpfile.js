/* global require */

( ( console ) => {
  "use strict";

  const bower = require( "gulp-bower" ),
    bump = require( "gulp-bump" ),
    del = require( "del" ),
    eslint = require( "gulp-eslint" ),
    gulp = require( "gulp" ),
    htmlreplace = require( "gulp-html-replace" ),
    runSequence = require( "run-sequence" ),
    wct = require( "web-component-tester" ).gulp.init( gulp ); // eslint-disable-line

  gulp.task( "clean-bower", ( cb ) => {
    del( [ "./bower_components/**" ], cb );
  } );

  gulp.task( "lint", () => {
    return gulp.src( [ "./**/*.js", "./**/*.html" ] )
      .pipe( eslint() )
      .pipe( eslint.format() )
      .pipe( eslint.failAfterError() );
  } );

  gulp.task( "version", () => {
    let pkg = require( "./package.json" );

    gulp.src( "./rise-data.html" )
      .pipe( htmlreplace( {
        "version": {
          src: pkg.version,
          tpl: "<script>var dataVersion = \"%s\";</script>"
        }
      }, { keepBlockTags: true } ) )
      .pipe( gulp.dest( "./" ) );
  } );

  // ***** Primary Tasks ***** //
  gulp.task( "bower-clean-install", [ "clean-bower" ], ( cb ) => {
    return bower().on( "error", ( err ) => {
      console.log( err );
      cb();
    } );
  } );

  gulp.task( "bump", () => {
    return gulp.src( [ "./package.json", "./bower.json" ] )
      .pipe( bump( { type: "patch" } ) )
      .pipe( gulp.dest( "./" ) );
  } );

  gulp.task( "test", ( cb ) => {
    runSequence( "test:local", cb );
  } );

  gulp.task( "build", [ "version" ], ( cb ) => {
    runSequence( "lint", cb );
  } );

  gulp.task( "default", [], () => {
    console.log( "********************************************************************".yellow );
    console.log( "  gulp bower-clean-install: delete and re-install bower components".yellow );
    console.log( "  gulp bump: increment the version".yellow );
    console.log( "  gulp test: run unit and integration tests".yellow );
    console.log( "  gulp build: build component".yellow );
    console.log( "********************************************************************".yellow );
    return true;
  } );

} )( console );
