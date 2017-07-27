/**
 * Create some file streams on the wire
 * @created  2017-07-27 16:10:53
 * @updated 
 */

var path = require("path"), fs = require("file-system");
var constants = require("./constants.js");
var source, destination, fileLists = new Map();

const {
    IgnoreExts,
    Foundation,
    Skeleton,
    EcoRoot,
    EcoSpace, } = constants; // extract

// expose things to parent module
module.exports = {
    constants,
    source, destination, fileLists, 
    beginStreaming,
    normalize, addToList
};
/* ================================================================= */

/**
 * add some files to streaming file lists
 * @param {array|string} files a string or a list of string represent some file(s)
 * @param {string} redirect redirect that 'files' in a new destination
 */
function addToList(files, redirect = "") {

    if (!isGoodList(files))
        if (!!files) files = [String(files)]; else return;

    for (let f of files) fileLists.set(f, redirect);

}


/**
 * start files streaming from previous setup
 */
function beginStreaming() {

    if (!source && !destination) throw new Error("Stream endpoints not set");
    if (!isGoodList(fileLists)) throw new Error("Nothing to Stream in file list");

    var multipleDests = isGoodList(destination);
    if (multipleDests) {
        multipleDests.forEach(eus => { // eus ~ ecosystem microservice
            start(Skeleton, path.join(EcoRoot, eus), files._, files.d);
        });
    } else start(Foundation, Skeleton, files._, files.d);

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
        process.stdout.write(`>>> ${destination} ::`);
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


/**
 * check if someArr is not an empty array
 * @param {array} someArr a reference to data that needs checking
 */
function isGoodList(someArr) {
    return Array.isArray(someArr) && someArr.length > 0;
}


/**
 * return a normalized, absolute path to a file
 * @param {string} dir prefix directory to following files
 * @param {string|undefined|null} get path result of a desired file
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