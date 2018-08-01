function(recipient, reason, impact, file, ellipsis) {
  const box = require('ellipsis-box');

uploadFile().then((fileInfo) => {
  const output = {
    senderId: ellipsis.userInfo.messageInfo.userId,
    senderName: ellipsis.userInfo.fullName,
    recipient: recipient,
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
    }]
  });
})

function uploadFile() {
  return new Promise((resolve, reject) => {
    if (file) {
      file.fetch().then(fetchResult => {
        box.files(ellipsis).uploadWithTimestamp(fetchResult.filename, fetchResult.contentType, fetchResult.value).then(uploadResult => {
          resolve({ url: uploadResult.url, filename: fetchResult.filename });
        })
      });
    } else {
      resolve(null); 
    }
  });
}
}
