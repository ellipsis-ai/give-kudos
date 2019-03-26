function(recipient, recipientNames, senderId, senderName, reason, impact, fileUrl, channel, ellipsis) {
  const randomResponse = require('ellipsis-random-response');
const EllipsisApi = require('ellipsis-api');
const actionsApi = new EllipsisApi(ellipsis).actions;
const client = require('google-client')(ellipsis);
const {google} = ellipsis.require('googleapis@38.0.0');
const sheets = google.sheets({
  version: 'v4',
  auth: client
});
const moment = require('moment-timezone');

const timestamp = moment.tz(ellipsis.teamInfo.timeZone).format('YYYY-MM-DD hh:mm:ss a');
const values = [[
  timestamp,
  senderId,
  senderName,
  recipient,
  recipientNames,
  reason,
  impact,
  fileUrl
]];

actionsApi.run({
  actionName: "publishMessage",
  channel: channel,
  args: [{
    name: "message",
    value: `
**<@${senderId}> has given kudos to ${recipient}!**

**What they did:**
${reason}

**Impact on the company:**
${impact}

${fileUrl === "(none)" ? "" : fileUrl}

**${randomResponse.responseWithEmoji("congratulatory")}**
`
  }]
}).then(() => {
  if (!ellipsis.env.KUDOS_SHEET_ID || !ellipsis.env.KUDOS_SHEET_NAME) {
    ellipsis.error("This skill requires two environment variables to be set so kudos can be saved to a spreadsheet: KUDOS_SHEET_ID and KUDOS_SHEET_NAME");
  } else {
    client.authorize().then(() => {
      const request = {
        spreadsheetId: ellipsis.env.KUDOS_SHEET_ID,
        range: ellipsis.env.KUDOS_SHEET_NAME,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: values
        },
        auth: client,
      };
      return sheets.spreadsheets.values.append(request).then((res) => {
        const updated = res.data.updates.updatedRows;
        if (updated == 0) {
          ellipsis.error(`Your kudos were published to the channel ${channel} but there was a problem saving them to the spreadsheet.`);
        } else {
          ellipsis.success(`Your kudos have been sent to the channel ${channel}.`);
        }
      });        
    });
  }
}).catch((err) => {
  throw new ellipsis.Error(err, {
    userMessage: "Something went wrong while trying to send kudos. Perhaps that channel doesn't exist?"
  });
});
}
