//  A script to generate new microservice
// @created 2017-07-27 16:38:10

var fs = require("fs-extra"), path = require("path");
var minimatch = require("minimatch");
// var cp = require("child_process");
var parseGitignore = require("parse-gitignore");

var args = require("yargs")
    .options({
        "s": { alias: ["service", "services"], type: "array", default: [] }
    })
    .argv;

const { Skeleton, EcoSpace, EcoRoot } = require("./constants.js");

if (!EcoSpace) throw new Error("A space is a void anyway...");

var microservices = args._.concat(args.services);
var ignores = parseGitignore(path.join(Skeleton, ".gitignore"), [".vscode"]);

var intoBlkHoles = ignores.map(ig => {
    // var trash = path.join(Skeleton, ig);
    return minimatch.filter(ig, { matchBase: true });
});

console.log(ignores, minimatch(path.join(Skeleton, ignores[0]), path.join(Skeleton, "dist/source")));

// for (let mus of microservices) {
//     try { generate(mus); }
//     catch (e) { console.infoi(`ERROR: ${e.message}`), console.error(e); }
// }

function generate(service) {

    console.info(`Start generating ${service}...`);

    var opts = { errorOnExist: true, filter: handleStream };
    // full path to microservice source
    var srcBranch = path.join(EcoRoot, EcoSpace, service);

    fs.copySync(Skeleton, srcBranch, opts);

}

function handleStream(src, dest) {

    console.log(src, '>>', dest);

    return true;

}