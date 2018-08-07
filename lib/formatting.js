/*
@exportId z-30YK6pR1eWuRQNQNQe3Q
*/
module.exports = (function() {
return {
  formatList(list) {
    if (!list.length) {
      return "";
    }
    const head = list.slice(0, list.length - 1).join(", ");
    const tail = list.length > 1 ? `, and ${list[list.length - 1]}` : "";
    return head + tail;
  }
}

})()
     