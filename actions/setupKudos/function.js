function(ellipsis) {
  const EllipsisApi = require('ellipsis-api');
const actionsApi = new EllipsisApi(ellipsis).actions;
actionsApi.deleteTeamSavedAnswers({
  inputName: "channel"
}).then(() => {
  ellipsis.success("", {
    next: {
      actionName: "setupKudos2"
    }
  });
});
}
