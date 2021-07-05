const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    return msg.channel.send("__State Map__", {files: ["./assets/statemap.png"]})
})

exports.command = command