function(message, ellipsis) {
  const randomResponse = require('ellipsis-random-response');
ellipsis.success(`
${randomResponse.greetingForTimeZone(ellipsis.teamInfo.timeZone)}

${message}
`, {
  choices: [{
    actionName: "giveKudos",
    label: "Give kudos to others",
    allowOthers: true,
    allowMultipleSelections: true,
    quiet: true
  }]
});
}
