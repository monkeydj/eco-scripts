// a script for copying files
// @updated 2017-08-03 09:43:00

var path = require("path"), fs = require("fs");
var constants = require("./constants.js");
var source, destination;

const {
    IgnoreExts,
    Foundation,
    Skeleton,
    EcoRoot,
    EcoSpace, } = constants;

// expose things to parent module
module.exports = {
    source, destination, constants,
    procedures: { start, normalize, copy }
};

/* ================================================================= */

var files = require("yargs")
    .options({
        "d": { alias: ["dest", "destination"] }, // to new diẻctory
        "s": { alias: ["sys", "system"], type: "array" }, // if copying system files
        "e": { alias: ["eco", "ecosystem", "eco-service"], type: "array" }, // list of service
        "f": { alias: ["file", "files"], type: "array" },  // same as normal file arguments
    }).argv; !!CRY_YARGS && console.log(files);

if (files.s) files._.push(...files.s.map(normalize("source/system")));
if (files.f) files._.push(...files.f);

!!CRY_YARGS && console.log(files._);
if (!files._.length) return console.info("Nothing to do!");

// start updating file in individual services
for (let service of files.e) {
    service = path.join(EcoRoot, EcoSpace, service);
    startProcedure(Skeleton, service, files, redirect);
}

/* ================================================================= */

/**
 * check if someArr is not an empty array
 * @param {array} someArr a reference to data that needs checking
 */
function isGoodList(someArr) {
    return Array.isArray(someArr) && someArr.length > 0;
}

/**
 * start copying files from source into destination
 * @param {string} source absolute path string
 * @param {string} destination absolute path string
 * @param {array<string>} files a list of copying files
 * @param {string} redirect alternate/change directory at destination
 */
function startProcedure(source, destination, files, redirect) {

    if (redirect) destination = path.join(destination, redirect);
    console.info(`=== Start from <${source}> into <${destination}> ===`);

    if (!isGoodList(files)) throw new Error("File list is empty!");
    files.forEach(f => copy(!!redirect ? path.basename(f) : f, source, destination));

}

/**
 * return a normalized, absolute path to a file
 * @param {string} dir prefix directory to following files
 * @param {string|undefined|null} file get path result of a desired file
 */
function normalize(dir, file) {

    return file ? join(file) : join;

    function join(fp) {

        var ext = (fp = String(fp)).slice(fp.lastIndexOf("."));
        // if extensions is not in ignorance list, and not ends with `.ts`
        if (IgnoreExts.indexOf(ext) < 0 && ext !== ".ts") fp += ".ts";

        return path.normalize(path.join(dir, fp));

    }

}

/**
 * copy specified file from Foundation into Skeleton
 * @param {string} file path to desired file in srcDir
 * @param {string} srcDir absolute path to source directory
 * @param {string} destDir absolute path to destination directory
 */
function copy(file, srcDir, destDir) {

    var source = normalize(srcDir, file),
        destination = normalize(destDir, file);

    console.info(`Preparing file... <<< ${source}`);

    var readFd = fs.createReadStream(source, createOpts({ flags: "r" })),
        writeFd = fs.createWriteStream(destination, createOpts({ flags: "w" }));
    // setup both read & write streams, and pipe them together
    readFd.on("error", cleanUp), writeFd.on("error", cleanUp);
    writeFd.on("close", cleanUp), readFd.pipe(writeFd);

    /**
     * final handler for stream (Fd=file descriptor)
     * @param {Error} err any error occured from creating file stream
     */
    function cleanUp(err) {
        process.stdout.write(`>>> ${destination} ... `);
        if (err) console.error(err); else console.info(`OK!`);
    }

    /**
     * apply default options for filesystem stream
     * @param {object} opts manual options
     */
    function createOpts(opts) {
        Object.assign(opts, { defaultEncoding: "utf8", autoClose: true });
    }

}
