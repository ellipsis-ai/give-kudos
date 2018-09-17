function(channel, recurrence, ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const randomResponse = require('ellipsis-random-response');
const actionsApi = new EllipsisApi(ellipsis).actions;
const moment = require('moment-timezone');

actionsApi.unschedule({
  actionName: "publishMessage",
  channel: channel
}).then(() => {
  return actionsApi.schedule({
    actionName: "publishMessage",
    channel: channel,
    recurrence: recurrence,
    args: [{
      name: "message",
      value: `Seen anyone go above and beyond recently? Give them kudos to recognize their accomplishments.`
    }]
  });
}).then((resp) => {
  if (resp.scheduled) {
    ellipsis.success(Object.assign({
      recurrence: resp.scheduled.recurrence,
      firstRecurrence: moment(resp.scheduled.firstRecurrence).tz(ellipsis.teamInfo.timeZone).format("LLLL")
    }));
  } else {
    throw new ellipsis.Error("Unknown scheduling error");
  }
}).catch((err) => {
  throw new ellipsis.Error(err, {
    userMessage: "Something went wrong and I couldn’t schedule that for you. Maybe try again?"
  });
});
}
