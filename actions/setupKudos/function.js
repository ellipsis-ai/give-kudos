function(channel, ellipsis) {
  const unsetVars = ["KUDOS_SHEET_NAME", "KUDOS_SHEET_ID"].filter((ea) => !ellipsis.env[ea]);
let result = "";
if (unsetVars.length === 2) {
  result = `The following environment variables need to be set to save kudos to a spreadsheet:
${unsetVars.join(", ")}`;
} else if (unsetVars.length === 1) {
  result = `The environment variable ${unsetVars[0]} needs to be set to save kudos to a spreadsheet.`
}
ellipsis.success(result);
}
