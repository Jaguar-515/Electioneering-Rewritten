const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    return msg.channel.send("__Colors__\n**Red**\n**Blue**\n**Green**\n**Yellow**\n**Gray**\n**Pink**\n**Purple**\n**Brown**");
})

exports.command = command