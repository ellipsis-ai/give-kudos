function(numDays, ellipsis) {
  const client = require('google-client')(ellipsis);
const {google} = ellipsis.require('googleapis@38.0.0');
const sheets = google.sheets({
  version: 'v4',
  auth: client
});
const inspect = require('util').inspect;
const moment = require('moment-timezone');
moment.tz.setDefault(ellipsis.teamInfo.timeZone);
const now = moment();
const min = now.clone().subtract(numDays, 'days');
const greeting = require('ellipsis-random-response').greetingForTimeZone(ellipsis.teamInfo.timeZone);

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
        const options = {
          choices: [{
            actionName: "giveKudos",
            label: "Give kudos",
            allowOthers: true,
            allowMultipleSelections: true,
            quiet: true
          }]
        };
        ellipsis.success(`
${greeting}

In the last ${numDays === 1 ? "day" : `${numDays} days`}, ${kudoTextFor(names)}
`, options);
      }
    });
  });
}

function kudoTextFor(names) {
  if (names.length === 0) {
    return "nobody has been given kudos. It’s never too late!"
  } else if (names.length === 1) {
    return `kudos have been given to ${names[0]}. Anyone else deserve a shout-out?`
  } else {
    return `kudos have been given out ${names.length} times. Well done:

- ${names.join("\n- ")}

Keep it coming!`
  }
}
}
