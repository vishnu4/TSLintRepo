/// <binding />
//https://stackoverflow.com/questions/31872622/using-grunt-bower-gulp-npm-with-visual-studio-2015-for-a-asp-net-4-5-project
//http://www.jeffreyfritz.com/2015/05/where-did-my-asp-net-bundles-go-in-asp-net-5/
//http://www.dotnetcurry.com/visualstudio/1096/using-grunt-gulp-bower-visual-studio-2013-2015
var paths = {
  bower: "bower_components/",
  node: "node_modules/",
  appjs: "Scripts/",
  appcss: "Content/",
  jsdist: "build/js",
  cldrdist: "build/cldr",
  momentLocaledist: "build/momentLocale",
  cssdist: "build/css",
  fontdist: "build/fonts",
  imgdist: "build/css/images"
};

var minifyOptions = {};

var gulp = require('gulp');
//var concat = require("gulp-concat"),
//  rename = require("gulp-rename"),
//  uglify = require("gulp-uglify");
//.pipe(minify(minifyOptions).on('error', gutil.log))
var uglifyjs = require('uglify-es'),
  composer = require('gulp-uglify/composer'),
  minify = composer(uglifyjs, console);       //using this because when i tried to modularize, i would get errors saying gulp-uglify couldn't work on es6 code
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var uglify_css = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var expect = require('gulp-expect-file');
var bower = require('gulp-bower');
var gutil = require('gulp-util');
var ts = require("gulp-typescript");
var gulpBabel = require('gulp-babel');
var tsProject = ts.createProject('tsconfig.json');
var sass = require('gulp-sass');
var merge = require('merge-stream');

//start fresh.  clean out the destination build folder
gulp.task('clean', function () {
  const rmPaths = [
    paths.jsdist,
    paths.cssdist,
    paths.fontdist,
    paths.cldrdist,
    paths.momentLocaledist
  ];

  return gulp.src(rmPaths, {
    read: false
  })
    .pipe(clean());
});

//install bower components.  needed for the tfs build server
gulp.task('bower', function () {
  return bower();
});

//compile all of the typescript files.
gulp.task("tsScripts", function () {
  var tsResult = gulp.src(paths.appjs + "**/*.ts")
    .pipe(sourcemaps.init())
    .pipe(tsProject());
  return tsResult.js
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.appjs));
});

gulp.task("babeltsScripts", ['tsScripts'], function () {
  var babeledTSScripts = [
    paths.appjs + "Controllers/**/*.js"
  ];

  var babeledTSScriptssrc = gulp.src(babeledTSScripts, { base: "./" })
    .pipe(expect(babeledTSScripts))
    .pipe(gulp.dest("."));

  var babeledTSScripts4 = [
    paths.appjs + "orgchart/**/*.js"
  ];

  var babeledTSScripts4src = gulp.src(babeledTSScripts4, { base: "./" })
    .pipe(expect(babeledTSScripts4))
    .pipe(gulp.dest("."));

  var babeledTSScripts2 = [
    paths.appjs + "thinkgeo/BasicMap.js",
    paths.appjs + "thinkgeo/BottomMapG.js",
    paths.appjs + "thinkgeo/googleGeoLocate.js",
    paths.appjs + "thinkgeo/MapInteraction.js",
    paths.appjs + "thinkgeo/MapTool.js",
    paths.appjs + "thinkgeo/PlumeManager.js",
    paths.appjs + "thinkgeo/ready-function-MainMap.js",
    paths.appjs + "thinkgeo/What3WordsLocate.js"
  ];

  var babeledTSScripts2src = gulp.src(babeledTSScripts2, { base: "./" })
    .pipe(expect(babeledTSScripts2))
    .pipe(gulp.dest("."));

  var babeledTSScripts3 = [
    paths.appjs + "basicCoBRAScript.js",
    paths.appjs + "cobartsStatus.js",
    paths.appjs + "jqAjaxCSF.js",
    paths.appjs + "signalRHubs.js",
  ];
  var babeledTSScripts3src = gulp.src(babeledTSScripts3)
    .pipe(expect(babeledTSScripts3))
    .pipe(gulp.dest(paths.appjs));

  return merge(babeledTSScriptssrc, babeledTSScripts2src, babeledTSScripts3src, babeledTSScripts4src);
});

gulp.task("jsFiles", ['tsScripts', 'babeltsScripts', 'bower', 'clean'], function () {

  var copiedFiles = [
    paths.node + "cache-digest-immutable/src/**.*",
    paths.node + "bootbox/bootbox.min.js",
    paths.node + "masonry-layout/dist/masonry.pkgd.js",
    paths.node + "masonry-layout/dist/masonry.pkgd.min.js",
    paths.node + "bootstrap-switch/dist/js/bootstrap-switch.min.js",
    paths.node + "dragula/dist/dragula.min.js",
    paths.node + "jQuery.print/jQuery.print.js"
  ];
  var copiedFilessrc = gulp.src(copiedFiles)
    .pipe(expect(copiedFiles))
    .pipe(gulp.dest(paths.jsdist));

  var cldrXtraFiles = [
    paths.node + "cldr-core/supplemental/likelySubtags.json"
  ];
  var cldrXtraFilessrc = gulp.src(cldrXtraFiles)
    .pipe(expect(cldrXtraFiles))
    .pipe(gulp.dest(paths.jsdist + "/supplemental"));

  var jqkendo = [
    paths.node + "jquery/dist/jquery.js",
    paths.appjs + "kendo/2017.3.913/kendo.web.js",
    paths.appjs + "kendo/2017.3.913/kendo.aspnetmvc.js"];
  var jqkendosrc = gulp.src(jqkendo)
    .pipe(expect(jqkendo))
    .pipe(sourcemaps.init())
    .pipe(concat("jqkendo.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("jqkendo.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var jqueryvalandbootFiles = [
    paths.node + "jquery-ajax-unobtrusive/jquery.unobtrusive-ajax.js",
    paths.node + "jquery-validation/dist/jquery.validate.js",
    paths.node + "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js",
    paths.node + "signalR/jquery.signalR.js",
    paths.node + "bootstrap/dist/js/bootstrap.js",
    paths.node + "imagesloaded/imagesloaded.pkgd.js",
    paths.node + "qtip2/dist/jquery.qtip.js",
    paths.appjs + "jquery.easy-ticker.js",
    paths.node + "jasny-bootstrap/dist/js/jasny-bootstrap.js",
    paths.appjs + "jqAjaxCSF.js",
    paths.node + "bootstrap-notify/bootstrap-notify.js",
    paths.node + "moment/moment.js",
    paths.appjs + "basicCoBRAScript.js",
    paths.appjs + "jquery.blockUI.js",
    paths.appjs + "signalRHubs.js"];
  var jqueryvalandbootFilessrc = gulp.src(jqueryvalandbootFiles)
    .pipe(expect(jqueryvalandbootFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("jqueryvalandboot.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("jqueryvalandboot.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var locationShareFiles = [
    paths.node + "urijs/src/URI.js",
    paths.bower + "usng.js/usng.js",
    paths.appjs + "thinkgeo/googleGeoLocate.js",
    paths.node + "cldrjs/dist/cldr.js",
    paths.node + "cldrjs/dist/cldr/event.js",
    paths.node + "cldrjs/dist/cldr/supplemental.js",
    paths.node + "cldrjs/dist/cldr/unresolved.js",
    paths.node + "globalize/dist/globalize.js",
    paths.node + "globalize/dist/globalize/number.js",
    paths.appjs + "thinkgeo/What3WordsLocate.js",
    paths.appjs + "thinkgeo/BottomMapG.js"
  ];
  var locationShareFilessrc = gulp.src(locationShareFiles)
    .pipe(expect(locationShareFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("locationShare.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("locationShare.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var parseBlockFiles = [
    paths.node + "autolinker/dist/Autolinker.js"
  ];
  var parseBlockFilessrc = gulp.src(parseBlockFiles)
    .pipe(expect(parseBlockFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("parseBlock.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("parseBlock.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var chatFiles = [
    paths.node + "autolinker/dist/Autolinker.js",
    paths.appjs + "Controllers/Tools/Chat/MainChatScript.js"
  ];
  var chatFilessrc = gulp.src(chatFiles)
    .pipe(expect(chatFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("chat.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("chat.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var multchatFiles = [
    paths.node + "autolinker/dist/Autolinker.js",
    paths.appjs + "Controllers/Tools/Chat/MultipleChatScript.js"
  ];
  var multchatFilessrc = gulp.src(multchatFiles)
    .pipe(expect(multchatFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("multChat.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("multChat.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var thinkgeojsFiles = [
    paths.appjs + "thinkgeo/ready-function-MainMap.js",
    paths.node + "jsts/dist/jsts.min.js",
    paths.appjs + "thinkgeo/MapInteraction.js",
    paths.appjs + "thinkgeo/BasicMap.js"
  ];
  var thinkgeojsFilessrc = gulp.src(thinkgeojsFiles)
    .pipe(expect(thinkgeojsFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("thinkgeojs.js").on('error', gutil.log))
    //.pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("thinkgeojs.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var thinkgeoPrejsFiles = [
    paths.appjs + "thinkgeo/opl_GeoResource.js",
    paths.appjs + "thinkgeo/extension_GeoResource.js",
    paths.appjs + "thinkgeo/helper_GeoResource.js",
    paths.appjs + "thinkgeo/binding_GeoResource.js",
    paths.appjs + "thinkgeo/parser_GeoResource.js",
    paths.appjs + "thinkgeo/func_GeoResource.js",
    paths.appjs + "thinkgeo/cm_GeoResource.js",
    paths.appjs + "thinkgeo/msajax_GeoResource.js"
  ];
  var thinkgeoPrejsFilessrc = gulp.src(thinkgeoPrejsFiles)
    .pipe(expect(thinkgeoPrejsFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("thinkgeoPrejs.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("thinkgeoPrejs.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    ;

  var AllMapjsFiles = [
    paths.appjs + "thinkgeo/ready-function-MainMap.js",
    paths.node + "jsts/dist/jsts.min.js",
    paths.appjs + "thinkgeo/MapInteraction.js",
    paths.appjs + "thinkgeo/MapTool.js",
    paths.appjs + "thinkgeo/BasicMap.js",
    paths.appjs + "thinkgeo/DynamicMeasure.js",
    paths.node + "urijs/src/URI.js",
    paths.node + "cldrjs/dist/cldr.js",
    paths.node + "cldrjs/dist/cldr/event.js",
    paths.node + "cldrjs/dist/cldr/supplemental.js",
    paths.node + "cldrjs/dist/cldr/unresolved.js",
    paths.node + "globalize/dist/globalize.js",
    paths.node + "globalize/dist/globalize/number.js",
    paths.node + "autolinker/dist/Autolinker.js",
  ];
  var AllMapjsFilessrc = gulp.src(AllMapjsFiles)
    .pipe(expect(AllMapjsFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("AllMapjs.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("AllMapjs.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var AllMapWithoutCustomjsFiles = [
    paths.node + "jsts/dist/jsts.min.js",
    paths.node + "urijs/src/URI.js",
    paths.node + "cldrjs/dist/cldr.js",
    paths.node + "cldrjs/dist/cldr/event.js",
    paths.node + "cldrjs/dist/cldr/supplemental.js",
    paths.node + "cldrjs/dist/cldr/unresolved.js",
    paths.node + "globalize/dist/globalize.js",
    paths.node + "globalize/dist/globalize/number.js",
    paths.node + "autolinker/dist/Autolinker.js"
  ];
  var AllMapWithoutCustomjsFilessrc = gulp.src(AllMapWithoutCustomjsFiles)
    .pipe(expect(AllMapWithoutCustomjsFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("AllMapWithoutCustomjs.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("AllMapWithoutCustomjs.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var globalMapFiles = [
    paths.appjs + "thinkgeo/BasicMap.js",
    paths.node + "urijs/src/URI.js"
  ];
  var globalMapFilessrc = gulp.src(globalMapFiles)
    .pipe(expect(globalMapFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("globalMap.js").on('error', gutil.log))
    //.pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("globalMap.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var geoposFiles = [
    paths.node + "cldrjs/dist/cldr.js",
    paths.node + "cldrjs/dist/cldr/event.js",
    paths.node + "cldrjs/dist/cldr/supplemental.js",
    paths.node + "cldrjs/dist/cldr/unresolved.js",
    paths.node + "globalize/dist/globalize.js",
    paths.node + "globalize/dist/globalize/number.js"
  ];
  var geoposFilessrc = gulp.src(geoposFiles)
    .pipe(expect(geoposFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("geopos.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("geopos.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var frmsPageFiles = [
    paths.appjs + "Controllers/Tools/Forms/FormSuggest.js",
    paths.appjs + "Controllers/Tools/Forms/OperationalPeriodModule.js",
    paths.appjs + "Controllers/Tools/Forms/AvailableForms.js",
    paths.appjs + "Controllers/Tools/Forms/Forms.js",
    paths.node + "urijs/src/URI.js",
    paths.node + "jQuery.print/jQuery.print.js"
  ];
  var frmsPageFilessrc = gulp.src(frmsPageFiles)
    .pipe(expect(frmsPageFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("frmsPage.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("frmsPage.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var iapPageFiles = [
    paths.appjs + "Controllers/Tools/IAP/IAP.js",
    paths.appjs + "Controllers/Tools/IAP/CurrentIAP.js",
    paths.appjs + "Controllers/Tools/Forms/OperationalPeriodModule.js",
    paths.appjs + "Controllers/Tools/Forms/AvailableForms.js",
    paths.appjs + "Controllers/Tools/Forms/Forms.js",
    paths.node + "jQuery.print/jQuery.print.js"
  ];
  var iapPageFilessrc = gulp.src(iapPageFiles)
    .pipe(expect(iapPageFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("iapPage.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("iapPage.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var iapCreateFiles = [
    paths.appjs + "Controllers/Tools/IAP/IAP.js",
    paths.appjs + "Controllers/Tools/Forms/Forms.js",
    paths.node + "jQuery.print/jQuery.print.js"
  ];
  var iapCreateFilessrc = gulp.src(iapCreateFiles)
    .pipe(expect(iapCreateFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("iapCreate.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("iapCreate.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var orgchartFiles = [
    paths.node + "d3/d3.js",
    //paths.node + "d3/build/d3.js",
    //paths.node + "d3/build/d3.node.js",
    paths.appjs + "orgChart/buildTree.js",
    paths.appjs + "orgChart/TreeManager.js",
    paths.appjs + "orgChart/helperFunctions.js",
    paths.appjs + "orgChart/roleService.js"
  ];
  var orgchartFilessrc = gulp.src(orgchartFiles)
    .pipe(expect(orgchartFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("orgchart.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("orgchart.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    ;

  var bottomMapFiles = [
    paths.appjs + "thinkgeo/BasicMap.js",
    paths.node + "urijs/src/URI.js",
    paths.bower + "usng.js/usng.js",
    paths.appjs + "thinkgeo/googleGeoLocate.js",
    paths.node + "cldrjs/dist/cldr.js",
    paths.node + "cldrjs/dist/cldr/event.js",
    paths.node + "cldrjs/dist/cldr/supplemental.js",
    paths.node + "cldrjs/dist/cldr/unresolved.js",
    paths.node + "globalize/dist/globalize.js",
    paths.node + "globalize/dist/globalize/number.js",
    paths.appjs + "thinkgeo/What3WordsLocate.js",
    paths.appjs + "thinkgeo/BottomMapG.js"
  ];
  var bottomMapFilessrc = gulp.src(bottomMapFiles)
    .pipe(expect(bottomMapFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("bottomMap.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("bottomMap.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var groupAngFiles = [
    paths.node + "angular/angular.js",
    paths.node + "angular-animate/angular-animate.js",
    paths.node + "angular-sanitize/angular-sanitize.js",
    paths.node + "angular-route/angular-route.js",
    paths.node + "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
    paths.appjs + "kendo/2017.3.913/kendo.angular.js"
    //,paths.appjs + "Controllers/Admin/Group/GroupJS.js"
  ];
  var groupAngFilessrc = gulp.src(groupAngFiles)
    .pipe(expect(groupAngFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("groupAng.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("groupAng.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var shareIncAngFiles = [
    paths.node + "angular/angular.js",
    paths.node + "angular-animate/angular-animate.js",
    paths.node + "angular-sanitize/angular-sanitize.js",
    paths.appjs + "kendo/2017.3.913/kendo.angular.js",
    paths.node + "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"
    //,paths.appjs + "Controllers/Admin/ProjectAdmin/angularProjectAdmin.js"
  ];
  var shareIncAngFilessrc = gulp.src(shareIncAngFiles)
    .pipe(expect(shareIncAngFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("shareIncAng.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("shareIncAng.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var serverDashFiles = [
    paths.node + "angular/angular.js",
    paths.node + "angular-animate/angular-animate.js",
    paths.node + "angular-sanitize/angular-sanitize.js",
    paths.node + "angular-masonry/angular-masonry.js",
    paths.node + "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
    paths.node + "masonry-layout/dist/masonry.pkgd.js"
    //,paths.appjs + "Controllers/Audit/ServerDashboard/Dashboard.js"
  ];
  var serverDashFilessrc = gulp.src(serverDashFiles)
    .pipe(expect(serverDashFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("serverDash.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("serverDash.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var emissarydashFiles = [
    paths.node + "angular/angular.js",
    paths.node + "angular-animate/angular-animate.js",
    paths.node + "angular-sanitize/angular-sanitize.js",
    paths.node + "angular-masonry/angular-masonry.js",
    paths.node + "masonry-layout/dist/masonry.pkgd.js",
    paths.node + "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js",
    paths.appjs + "kendo/2017.3.913/kendo.angular.js",
    paths.appjs + "thinkgeo/BasicMap.js",
    paths.node + "urijs/src/URI.js",
    paths.bower + "usng.js/usng.js",
    paths.appjs + "thinkgeo/googleGeoLocate.js",
    paths.node + "cldrjs/dist/cldr.js",
    paths.node + "cldrjs/dist/cldr/event.js",
    paths.node + "cldrjs/dist/cldr/supplemental.js",
    paths.node + "cldrjs/dist/cldr/unresolved.js",
    paths.node + "globalize/dist/globalize.js",
    paths.node + "globalize/dist/globalize/number.js",
    paths.appjs + "thinkgeo/What3WordsLocate.js",
    paths.appjs + "thinkgeo/BottomMapG.js",
    paths.node + "angular-ui-swiper/dist/angular-ui-swiper.js"
    //,paths.appjs + "Controllers/EMISSARY/Dashboard/DashboardJS.js" //get this error here : Failed to instantiate module cobraapp due to: Error: [$injector:unpr] Unknown provider: e
  ];
  var emissarydashFilessrc = gulp.src(emissarydashFiles)
    .pipe(expect(emissarydashFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("emissarydash.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("emissarydash.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));


  var plumeFiles = [
    paths.appjs + "thinkgeo/PlumeManager.js",
    paths.node + "globalize/dist/globalize.js"
  ];
  var plumeFilessrc = gulp.src(plumeFiles)
    .pipe(expect(plumeFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("plume.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("plume.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var backgroundAdminFiles = [
    paths.bower + "twitter-bootstrap-wizard/jquery.bootstrap.wizard.js",
    paths.appjs + "Controllers/Admin/BackgroundMapDataAdmin/BackgroundMapData.js"
  ];
  var backgroundAdminFilessrc = gulp.src(backgroundAdminFiles)
    .pipe(expect(backgroundAdminFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("backgroundAdmin.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("backgroundAdmin.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var backgroundWMSAdminFiles = [
    paths.bower + "twitter-bootstrap-wizard/jquery.bootstrap.wizard.js",
    paths.appjs + "Controllers/Admin/BackgroundMapDataAdmin/WMSMapData.js"
  ];
  var backgroundAdminWMSFilessrc = gulp.src(backgroundWMSAdminFiles)
    .pipe(expect(backgroundWMSAdminFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("WMSMapData.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("WMSMapData.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var addressLookUpFiles = [
    paths.appjs + "Controllers/Shared/AddressSelector.js"
  ];
  var addressLookUpFilessrc = gulp.src(addressLookUpFiles)
    .pipe(expect(addressLookUpFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("AddressSelector.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("AddressSelector.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var userLookUpFiles = [
    paths.appjs + "Controllers/Shared/UserSelector.js"
  ];
  var userLookUpFilessrc = gulp.src(userLookUpFiles)
    .pipe(expect(userLookUpFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("UserSelector.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("UserSelector.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var orgLookUpFiles = [
    paths.appjs + "Controllers/Shared/OrgSelector.js"
  ];
  var orgLookUpFilessrc = gulp.src(orgLookUpFiles)
    .pipe(expect(orgLookUpFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("OrgSelector.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("OrgSelector.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var SuborgLookUpFiles = [
    paths.appjs + "Controllers/Shared/SubOrgSelector.js"
  ];
  var SuborgLookUpFilessrc = gulp.src(SuborgLookUpFiles)
    .pipe(expect(SuborgLookUpFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("SubOrgSelector.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("SubOrgSelector.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var facLookUpFiles = [
    paths.appjs + "Controllers/Shared/FacSelector.js"
  ];
  var facLookUpFilessrc = gulp.src(facLookUpFiles)
    .pipe(expect(facLookUpFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("FacSelector.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("FacSelector.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var usrPassFiles = [
    paths.node + "zxcvbn/dist/zxcvbn.js",
    paths.appjs + "Controllers/Admin/User/userFunctions.js"
  ];
  var usrPassFilessrc = gulp.src(usrPassFiles)
    .pipe(expect(usrPassFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("usrPass.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("usrPass.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  return merge(copiedFilessrc, cldrXtraFilessrc, jqkendosrc, jqueryvalandbootFilessrc, locationShareFilessrc, parseBlockFilessrc,
    chatFilessrc, multchatFilessrc, thinkgeojsFilessrc, thinkgeoPrejsFilessrc, AllMapjsFilessrc, AllMapWithoutCustomjsFilessrc,
    globalMapFilessrc, geoposFilessrc, frmsPageFilessrc, iapPageFilessrc, iapCreateFilessrc, orgchartFilessrc, bottomMapFilessrc,
    groupAngFilessrc, shareIncAngFilessrc, serverDashFilessrc, emissarydashFilessrc, plumeFilessrc, backgroundAdminFilessrc,
    backgroundAdminWMSFilessrc,
    addressLookUpFilessrc, userLookUpFilessrc, orgLookUpFilessrc, SuborgLookUpFilessrc, facLookUpFilessrc, usrPassFilessrc);
});

gulp.task("mobileJsFiles", ['tsScripts', 'clean'], function () {

  var jqkendo = [
    paths.node + "jquery/dist/jquery.js",
    paths.appjs + "kendo/2017.3.913/kendo.web.js",
    paths.appjs + "kendo/2017.3.913/kendo.aspnetmvc.js",
    paths.appjs + "kendo/2017.3.913/kendo.mobile.js"];
  var jqkendosrc = gulp.src(jqkendo)
    .pipe(expect(jqkendo))
    .pipe(sourcemaps.init())
    .pipe(concat("jqkendoMobile.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("jqkendoMobile.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  var jqueryvalandbootFiles = [
    paths.node + "jquery-ajax-unobtrusive/jquery.unobtrusive-ajax.js",
    paths.node + "jquery-validation/dist/jquery.validate.js",
    paths.node + "jquery-validation-unobtrusive/jquery.validate.unobtrusive.js",
    paths.node + "signalR/jquery.signalR.js",
    paths.node + "bootstrap/dist/js/bootstrap.js",
    paths.node + "imagesloaded/imagesloaded.pkgd.js",
    paths.appjs + "jqAjaxCSF.js",
    paths.node + "bootstrap-notify/bootstrap-notify.js",
    paths.node + "moment/moment.js",
    paths.appjs + "basicCoBRAScript.js",
    paths.appjs + "jquery.blockUI.js",
    paths.appjs + "signalRHubs.js"];
  var jqueryvalandbootFilessrc = gulp.src(jqueryvalandbootFiles)
    .pipe(expect(jqueryvalandbootFiles))
    .pipe(sourcemaps.init())
    .pipe(concat("jqueryvalandbootMobile.js").on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist))
    .pipe(minify(minifyOptions).on('error', gutil.log))
    .pipe(rename("jqueryvalandbootMobile.min.js").on('error', gutil.log))
    .pipe(sourcemaps.write('.').on('error', gutil.log))
    .pipe(gulp.dest(paths.jsdist));

  return merge(jqkendosrc, jqueryvalandbootFilessrc);
});

gulp.task('watch', ['ts:watch', 'sass:watch']);

gulp.task('ts:watch', function () {
  return gulp.watch(paths.appjs + "**/*.ts", ['tsScripts']);
});

gulp.task('cleansass', function () {
  var clean2 = gulp.src(paths.appcss + "ExtraStyles/**/*.css", { read: false }).pipe(clean());
  var clean3 = gulp.src(paths.appcss + "orgchart/**/*.css", { read: false }).pipe(clean());
  var clean4 = gulp.src(paths.appcss + "thinkgeo/**/*.css", { read: false }).pipe(clean());
  var clean1 = gulp.src(paths.appcss + "*.css", { read: false }).pipe(clean());
  return merge(clean4, clean2, clean3, clean1);
});

gulp.task('sass', ['cleansass'], function () {
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };

  var sassAppCss = [
    paths.appcss + "*.scss"
  ];
  var sassAppExCss = [
    paths.appcss + "ExtraStyles/**/*.scss"
  ];
  var sassAppOrgCss = [
    paths.appcss + "orgchart/**/*.scss"
  ];
  var sassAppThinkCss = [
    paths.appcss + "thinkgeo/**/*.scss"
  ];

  var sassAppCsssrc = gulp.src(sassAppCss)
    .pipe(sourcemaps.init())
    .pipe(expect(sassAppCss))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.appcss));

  var sassAppExCsssrc = gulp.src(sassAppExCss)
    .pipe(sourcemaps.init())
    .pipe(expect(sassAppExCss))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.appcss + "ExtraStyles/"));

  var sassAppOrgCsssrc = gulp.src(sassAppOrgCss)
    .pipe(sourcemaps.init())
    .pipe(expect(sassAppOrgCss))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.appcss + "orgchart/"));

  var sassAppThinkCsssrc = gulp.src(sassAppThinkCss)
    .pipe(sourcemaps.init())
    .pipe(expect(sassAppThinkCss))
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.appcss + "thinkgeo/"));

  return merge(sassAppCsssrc, sassAppExCsssrc, sassAppOrgCsssrc, sassAppThinkCsssrc);
});


gulp.task('sass:watch', function () {
  return gulp.watch(paths.appcss + "**/*.scss", ['sass']).on('change', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});

gulp.task("cssFiles", ['bower', 'clean', 'sass'], function () {

  var mapFiles = [
    paths.node + "bootstrap/dist/css/bootstrap.css.map",
    paths.node + "jasny-bootstrap/dist/css/jasny-bootstrap.css.map"
  ];
  var mapFilessrc = gulp.src(mapFiles)
    .pipe(expect(mapFiles))
    .pipe(gulp.dest(paths.cssdist));

  var bootCssFiles = [
    paths.node + "bootstrap/dist/css/bootstrap.min.css",    //why copy this as well?
    paths.node + "bootstrap/dist/css/bootstrap-theme.min.css",    //why copy this as well?
    paths.node + "css-toggle-switch/dist/toggle-switch.css",
    paths.node + "angular-motion/dist/angular-motion.min.css",
    paths.node + "dragula/dist/dragula.min.css",
    paths.appcss + "ExtraStyles/print.css",
    paths.appcss + "ExtraStyles/IAPVerticalTabs.css",
    paths.appcss + "ExtraStyles/PickerStyles.css",
    paths.appcss + "ExtraStyles/ServerDashboard.css",
    paths.appcss + "ExtraStyles/SymbologyPartialView.css",
    paths.appcss + "ExtraStyles/TimersCSS.css",
    paths.appcss + "orgChart/Tree.css"
  ];
  var bootCssFilessrc = gulp.src(bootCssFiles)
    .pipe(expect(bootCssFiles))
    .pipe(gulp.dest(paths.cssdist));

  var cssFiles = [
    paths.node + "bootstrap/dist/css/bootstrap.css",
    paths.node + "bootstrap/dist/css/bootstrap-theme.css",
    paths.node + "hover.css/css/hover.css",
    paths.node + "qtip2/dist/jquery.qtip.css",
    paths.node + "jasny-bootstrap/dist/css/jasny-bootstrap.min.css",
    paths.appcss + "kendo/2017.3.913/kendo.common.min.css",
    paths.appcss + "SmallSite.css"
  ];
  var cssFilessrc = gulp.src(cssFiles)
    .pipe(expect(cssFiles))
    .pipe(concat("css.css"))
    .pipe(gulp.dest(paths.cssdist))
    .pipe(rename("css.min.css"))
    .pipe(uglify_css())
    .pipe(gulp.dest(paths.cssdist));

  var nightcssFiles = [
    paths.appcss + "customNight.css"
  ];
  var nightcssFilessrc = gulp.src(nightcssFiles)
    .pipe(expect(nightcssFiles))
    .pipe(concat("nightcss.css"))
    .pipe(gulp.dest(paths.cssdist))
    .pipe(rename("nightcss.min.css"))
    .pipe(uglify_css())
    .pipe(gulp.dest(paths.cssdist));

  var moonlightcssFiles = [
    paths.appcss + "customMoonLight.css"
  ];
  var moonlightcssFilessrc = gulp.src(moonlightcssFiles)
    .pipe(expect(moonlightcssFiles))
    .pipe(concat("moonlightcss.css"))
    .pipe(gulp.dest(paths.cssdist))
    .pipe(rename("moonlightcss.min.css"))
    .pipe(uglify_css())
    .pipe(gulp.dest(paths.cssdist));

  var thinkgeocssFiles = [
    paths.appcss + "thinkgeo/basicMap.css",
    paths.appcss + "thinkgeo/MapStyles.css"
  ];
  var thinkgeocssFilessrc = gulp.src(thinkgeocssFiles)
    .pipe(expect(thinkgeocssFiles))
    .pipe(concat("thinkgeocss.css"))
    .pipe(gulp.dest(paths.cssdist))
    .pipe(rename("thinkgeocss.min.css"))
    .pipe(uglify_css())
    .pipe(gulp.dest(paths.cssdist));

  var cssEMISSARYFiles = [
    paths.node + "angular-motion/dist/angular-motion.css",
    paths.node + "angular-ui-swiper/dist/angular-ui-swiper.css",
    paths.appcss + "ExtraStyles/DashboardCSS.css"
  ];
  var cssEMISSARYFilessrc = gulp.src(cssEMISSARYFiles)
    .pipe(expect(cssEMISSARYFiles))
    .pipe(concat("cssEMISSARY.css"))
    .pipe(gulp.dest(paths.cssdist))
    .pipe(rename("cssEMISSARY.min.css"))
    .pipe(uglify_css())
    .pipe(gulp.dest(paths.cssdist));

  return merge(mapFilessrc, bootCssFilessrc, cssFilessrc, nightcssFilessrc, moonlightcssFilessrc, thinkgeocssFilessrc, cssEMISSARYFilessrc);
});

gulp.task("mobileCssFiles", ['clean', 'sass', 'cleansass', "cssFiles"], function () {
  var cssFiles = [
    paths.appcss + "kendo/2017.3.913/kendo.common.min.css",
    paths.appcss + "kendo/2017.3.913/kendo.mobile.all.min.css",
    paths.node + "bootstrap/dist/css/bootstrap.css",
    paths.node + "bootstrap/dist/css/bootstrap-theme.css",
    paths.appcss + "SiteMobile.css"
  ];
  var cssFilessrc = gulp.src(cssFiles)
    .pipe(expect(cssFiles))
    .pipe(concat("cssMobile.css"))
    .pipe(gulp.dest(paths.cssdist))
    .pipe(rename("cssMobile.min.css"))
    .pipe(uglify_css())
    .pipe(gulp.dest(paths.cssdist));

  return cssFilessrc;

});

gulp.task('icons', ['clean'], function () {
  var kendoTextures = [paths.appcss + "kendo/2017.3.913/textures/**.*"];
  var kendoTexturesrc = gulp.src(kendoTextures)
    .pipe(expect(kendoTextures))
    .pipe(gulp.dest(paths.cssdist + "/textures"));

  var kendoFonts = [paths.appcss + "kendo/2017.3.913/fonts/DejaVu/**.*"];
  var kendoFontssrc = gulp.src(kendoFonts)
    .pipe(expect(kendoFonts))
    .pipe(gulp.dest(paths.cssdist + "/fonts/DejaVu"));

  var kendoFonts2 = [paths.appcss + "kendo/2017.3.913/fonts/glyphs/**.*"];
  var kendoFonts2src = gulp.src(kendoFonts2)
    .pipe(expect(kendoFonts2))
    .pipe(gulp.dest(paths.cssdist + "/fonts/glyphs"));

  var kendoImages = [paths.appcss + "kendo/2017.3.913/images/**.*"];
  var kendoImagessrc = gulp.src(kendoImages)
    .pipe(expect(kendoImages))
    .pipe(gulp.dest(paths.cssdist + "/images"));

  //this is here cause i'm lazy
  var cldrFiles = [paths.node + "cldr-data/main/**/*"];
  var cldrFilessrc = gulp.src(cldrFiles)
    .pipe(expect(cldrFiles))
    .pipe(gulp.dest(paths.cldrdist + "/main"));

  var cldrsupFiles = [paths.node + "cldr-data/supplemental/**/*"];
  var cldrsupFilessrc = gulp.src(cldrsupFiles)
    .pipe(expect(cldrsupFiles))
    .pipe(gulp.dest(paths.cldrdist + "/supplemental"));

  var momentLocalFiles = [paths.node + "moment/locale/**/*"];
  var momentLocalFilessrc = gulp.src(momentLocalFiles)
    .pipe(expect(momentLocalFiles))
    .pipe(gulp.dest(paths.momentLocaledist));

  return merge(kendoFontssrc, kendoTexturesrc, kendoFonts2src, kendoImagessrc, cldrFilessrc, cldrsupFilessrc, momentLocalFilessrc);

});

// Default Task
gulp.task('default', ['babeltsScripts', 'cssFiles', 'jsFiles', 'mobileCssFiles', 'mobileJsFiles', 'icons']);/// <binding />
