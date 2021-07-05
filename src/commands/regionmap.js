const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    msg.channel.send("__Regions Map__", {files: ["./assets/RegionMap.png"]})
})

exports.command = command