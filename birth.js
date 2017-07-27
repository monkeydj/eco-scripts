var fork = require("child_process").fork;
var readdirSync = require("fs").readdirSync;
var join = require("path").join;

const Defaults = {
    ECO_ROOT: __dirname,
    ECO_FILE: "ecosystem.yaml",
    SRC_INDEX: "server.js",
    SRC_WD: "dist/source/components",
    CONF: { watch: true }
};

console.info("Loading preset configurations...");
const {
    ECO_ROOT, ECO_FILE,
    SRC_INDEX, SRC_WD
} = Object.assign(Defaults, process.env);

const Eco_config = { apps: [] };

console.info("Reading root of ecosystem...");
for (let src of readdirSync(ECO_ROOT)) {
    let conf = {
        script: join(ECO_ROOT, src, SRC_INDEX),
        cwd: join(ECO_ROOT, src, SRC_WD),
        name: src
    };
    conf = Object.assign(Defaults.CONF, conf);
    Eco_config.apps.push(conf);
}

console.info("Configuration generated!");
console.info(Eco_config);
console.info("Starting the ecosystem...");