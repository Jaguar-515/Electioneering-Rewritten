const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    return msg.reply("Electioneering Rewritten is on version **1.0.0**.")
})

exports.command = command