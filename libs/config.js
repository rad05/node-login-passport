var nconf = require("nconf");
var path = require("path");

function Config() {
    nconf.argv().env("");
    var environment = nconf.get("NODE:ENV") || "development";
    nconf.file(environment, path.resolve(__dirname, "../configs/"+environment+".json"));
    nconf.file("default", path.resolve(__dirname, "../configs/default.json"));
}

Config.prototype.get = function (key) {
    return nconf.get(key);
};

Config.prototype.set = function(key, val) {
    nconf.set(key, val);
    return
};

module.exports = new Config();
