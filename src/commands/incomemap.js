const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    msg.channel.send("__Income Map__", {files: ["./assets/IncomeMap.png"]})
})

exports.command = command