
var files = require("yargs")
    .options({
        "d": { alias: ["dest", "destination"] },
        "s": { alias: ["sys", "system"], type: "array" },
        "e": { alias: ["eco", "ecosystem", "eco-service"], type: "array" },
        "f": { alias: ["file", "files"], type: "array" },
    }).argv; // passing data in procedure
!!CRY_YARGS && console.log(files);

if (files.s) files._.push(...files.s.map(normalize("source/system")));
if (files.f) files._.push(...files.f);

!!CRY_YARGS && console.log(files._);
if (!files._.length) return console.info("Nothing to do!");
