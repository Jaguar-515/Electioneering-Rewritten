const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    return msg.reply("coming soon")
})

exports.command = command