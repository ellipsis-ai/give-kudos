/*
@exportId z-30YK6pR1eWuRQNQNQe3Q
*/
module.exports = (function() {
return {
  formatList(list) {
    if (!list.length) {
      return "";
    }
    if (list.length === 1) {
      return list[0];
    } else {
      const head = list.slice(0, list.length - 1).join(", ");
      let tail = "";
      if (list.length > 2) {
        tail = `, and ${list[list.length - 1]}`;
      } else if (list.length === 2) {
        tail = ` and ${list[list.length - 1]}`;
      }
      return head + tail;
    }
  }
}

})()
     