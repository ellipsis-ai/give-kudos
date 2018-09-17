function(message, ellipsis) {
  ellipsis.success(message, {
  choices: [{
    actionName: "giveKudos",
    label: "Give more kudos"
  }]
});
}
