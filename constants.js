// Static configurations
// @created  2017-07-27 14:56:28
// @updated 2017-07-27 17:03:34

const {
    FOUNDATION, SKELETON,
    ECO_ROOT, ECO_SPACE,
    CRY_YARGS } = process.env; // extract environment variables

exports.IgnoreExts = [".md", ".js", ".json"];
// alter with default values when not specified
exports.Foundation = FOUNDATION || "F:/src/service-nodejs/";
exports.Skeleton = SKELETON || "F:/src/micro-skeleton/";
exports.EcoRoot = ECO_ROOT || "F:/src";
exports.EcoSpace = ECO_SPACE ||
    function () { throw new Error("A space is a void anyway...") }();