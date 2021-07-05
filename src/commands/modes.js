const commandBase = require("../commandBase").commandBase

let command = new commandBase(function(msg) {
    return msg.channel.send("**__FPTP__**: The real-life system of U.S. Presidential elections.\n**__InstantRunoff__**: If nobody hits 270 electoral votes, the person with the fewest votes is eliminated. This repeats until someone hits 270.\n**__PopularVote__**: The person with the most votes wins.\n**__PopularVoteIRV__**: If nobody recieves 50% of the votes, the person with the fewest votes is eliminated. This is repeated until someone hits 50%.\n")
})

exports.command = command