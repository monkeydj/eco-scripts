//  A script to generate new microservice
// @created 2017-07-27 16:38:10

var fs = require("file-system"), path = require("path");
// var cp = require("child_process");
var parseGitignore = require("parse-gitignore");

var args = require("yargs")
    .options({
        "s": { alias: ["service", "services"], type: "array", default: [] }
    })
    .argv;

const { Skeleton, EcoSpace, EcoRoot } = require("./constants.js");

if (EcoSpace == undefined) throw new Error("A space is a void anyway");

var microservices = args._.concat(args.services);
var ignores = parseGitignore(path.join(Skeleton, ".gitignore"), [".vscode"]);

for (let mus of microservices) {
    
    console.info(`Start generating ${mus}...`);
    
    mus = path.join(EcoSpace, mus); // full path to microservice source
    fs.copySync(Skeleton, mus, { noProcess: ignores, process });

    function process(content, filepath, relative) {
        console.log(`Adding file ${filepath}... >>> ${relative}`);
    }

}
