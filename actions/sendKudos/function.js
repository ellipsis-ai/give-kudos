function(recipient, recipientNames, senderId, senderName, reason, impact, fileUrl, channel, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const randomResponse = require('ellipsis-random-response');
const actionsApi = new EllipsisApi(ellipsis).actions;
actionsApi.say({
  message: `
${randomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone)}

**<@${senderId}> has given kudos to ${recipient}!**

**What they did:**
${reason}

**Impact on the company:**
${impact}

${fileUrl === "(none)" ? "" : fileUrl}

**${randomResponse.responseWithEmoji("congratulatory")}**
`,
  channel: channel
}).then(() => {
  ellipsis.success(`Your kudos have been sent to the channel ${channel}.`)
}).catch((err) => {
  throw new ellipsis.Error(err, {
    userMessage: "Something went wrong while trying to send kudos. Perhaps that channel doesn't exist?"
  });
});
}
