const { src, dest, series, parallel, watch } = require("gulp");
const clean = require("gulp-clean");
const uglify = require("gulp-uglify-es").default;
const uglifyCSS = require("gulp-clean-css");
const connect = require("gulp-connect");

const isDevelopment = process.env.NODE_ENV === "development";

const inputJS = "./exchange-rates.js";
const inputCSS = "./style.css";
const inputHTML = "./index.html";

const outputJS = "public/js";
const outputCSS = "public/css";
const outputHTML = "public";

function cleanJS() {
  return src(outputJS, { read: false, allowEmpty: true }).pipe(clean());
}

function copyJS() {
  return src(inputJS).pipe(dest(outputJS));
}

function minifyJS() {
  return src(inputJS).pipe(uglify()).pipe(dest(outputJS));
}

const runJSDevTasks = series(cleanJS, copyJS);
const runJSProdTasks = series(cleanJS, minifyJS);

function cleanCSS() {
  return src(outputCSS, { read: false, allowEmpty: true }).pipe(clean());
}

function copyCSS() {
  return src(inputCSS).pipe(dest(outputCSS));
}

function minifyCSS() {
  return src(inputCSS).pipe(uglifyCSS()).pipe(dest(outputCSS));
}

const runCSSDevTasks = series(cleanCSS, copyCSS);
const runCSSProdTasks = series(cleanCSS, minifyCSS);

function copyHTML() {
  return src(inputHTML).pipe(dest(outputHTML));
}

function startServer(done) {
  connect.server({
    root: "public",
    livereload: true,
  });
  done();
}

function reloadServer(done) {
  connect.reload();
  done();
}

const runDevTasks = parallel(runJSDevTasks, runCSSDevTasks, copyHTML);

const runProdTasks = parallel(runJSProdTasks, runCSSProdTasks, copyHTML);

function watchTask(done) {
  watch(
    "./*js",
    isDevelopment
      ? series(runDevTasks, reloadServer)
      : series(runProdTasks, reloadServer)
  );
  watch(
    ["./*css"],
    isDevelopment
      ? series(runDevTasks, reloadServer)
      : series(runProdTasks, reloadServer)
  );
  watch(
    ["./index.html"],
    isDevelopment
      ? series(runDevTasks, reloadServer)
      : series(runProdTasks, reloadServer)
  );
  done();
}

exports.default = isDevelopment
  ? series(parallel(runDevTasks, watchTask), startServer)
  : series(parallel(runProdTasks, watchTask), startServer);
