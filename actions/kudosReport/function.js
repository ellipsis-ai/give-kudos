function(numDays, ellipsis) {
  const client = require('google-client')(ellipsis);
const {google} = require('googleapis');
const sheets = google.sheets('v4');
const inspect = require('util').inspect;
const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.teamInfo.timeZone);
const now = moment();
const min = now.clone().subtract(numDays, 'days');
const humanizeList = ellipsis.require('humanize-list@1.0.1');

if (!ellipsis.env.KUDOS_SHEET_ID || !ellipsis.env.KUDOS_SHEET_NAME) {
  ellipsis.error("This skill requires two environment variables to be set so kudos can be saved to a spreadsheet: KUDOS_SHEET_ID and KUDOS_SHEET_NAME");
} else {
  client.authorize().then(() => {
    const request = {
      spreadsheetId: ellipsis.env.KUDOS_SHEET_ID,
      range: ellipsis.env.KUDOS_SHEET_NAME,
      auth: client,
    };
    return sheets.spreadsheets.values.get(request).then((res) => {
      const values = res.data ? res.data.values.slice(1) : null;
      if (!values) {
        ellipsis.error("The spreadsheet did not return any data.", {
          userMessage: "Something went wrong and the spreadsheet did not return any data."
        });
      } else {
        const withinRange = values.filter((row) => {
          const firstColumn = row[0];
          const timestamp = firstColumn ? moment(firstColumn, "YYYY-MM-DD h:mm:ss A") : null;
          return timestamp && timestamp.isAfter(min);
        });
        const names = withinRange.map((row) => {
          return row[3] || row[4] || null
        }).filter((ea) => Boolean(ea));
        const nameText = humanizeList(names, { oxfordComma: true });
        ellipsis.success(`In the last ${
            numDays === 1 ? "day" : `${numDays} days`
        }, ${kudoTextFor(names.length, nameText)}`, {
          choices: [{
            actionName: "giveKudos",
            label: "Give kudos",
            allowOthers: true,
            allowMultipleSelections: true
          }]
        });
      }
    });
  });
}

function kudoTextFor(numPeople, nameText) {
  if (numPeople === 0) {
    return "nobody has been given kudos. It’s not too late!"
  } else if (numPeople === 1) {
    return `kudos have been given to ${nameText}. Anyone else deserving?`
  } else {
    return `${numPeople} people have been given kudos: ${nameText}. Keep it coming!`
  }
}
}
