function(recipient, reason, impact, file, ellipsis) {
  const box = ellipsis.require('ellipsis-box@0.3.1');
const formatList = require('formatting').formatList;

uploadFile().then((fileInfo) => {
  const recipientUsers = usersForName(recipient);
  const recipientNames = recipientUsers ? formatList(recipientUsers) : recipient;
  const recipientLink = recipientUsers ? formatList(recipientUsers.map((ea) => {
    const user = userLinkForUser(ea);
    if (user) {
      return `<@${user.userIdForContext}>`;
    } else {
      return `@${ea}`;
    }
  })) : recipient;
  const output = {
    senderId: ellipsis.userInfo.messageInfo.userId,
    senderName: ellipsis.userInfo.fullName,
    recipient: recipientLink,
    recipientNames: recipientNames,
    reason: reason,
    impact: impact,
    fileUrl: fileInfo ? fileInfo.url : "(none)"
  };
  ellipsis.success(output, {
    files: fileInfo ? [fileInfo] : [],
    choices: [{
      label: "Publish kudos",
      actionName: "sendKudos",
      args: Object.keys(output).map((key) => ({
        name: key,
        value: output[key]
      }))
    }, {
      label: "Start over",
      actionName: "giveKudos"
    }]
  });
})

function uploadFile() {
  return new Promise((resolve, reject) => {
    if (file) {
      file.fetch().then(fetchResult => {
        box.files(ellipsis).uploadWithTimestamp(fetchResult.filename, fetchResult.contentType, fetchResult.value).then(uploadResult => {
          resolve({ url: uploadResult.downloadUrl, filename: fetchResult.filename });
        })
      });
    } else {
      resolve(null); 
    }
  });
}

function usersForName(formattedNames) {
  if (/@/.test(formattedNames)) {
    return formattedNames
      .split("@")
      .map((ea) => ea.replace(/,\s*/g, "").replace(/\s*(and|\&|\+)\s*$/g, "").trim())
      .filter((ea) => Boolean(ea));
  } else {
    return null;
  }
}

function userLinkForUser(name) {
  return ellipsis.userInfo.messageInfo.usersMentioned.find((user) => {
    return user.userName === name || user.fullName === name;
  });
}
}
