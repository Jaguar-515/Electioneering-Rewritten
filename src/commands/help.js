const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    return msg.channel.send("coming soon...")
})

exports.command = command