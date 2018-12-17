import { outbox } from "file-transfer";
import { Image } from "image";
import { device } from "peer";
import { settingsStorage } from "settings";
import * as fs from "fs";
import * as messaging from "messaging";


settingsStorage.setItem("screenWidth", device.screen.width);
settingsStorage.setItem("screenHeight", device.screen.height);

messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  console.log(JSON.stringify(evt.data));
  sendTZ();
}

settingsStorage.onchange = function(evt) {
  if (evt.key === "background-image") {
    compressAndTransferImage(evt.newValue);
  } else {
    let data = {
      key: evt.key,
      newValue: evt.newValue
    };
    sendVal(data);
  }  
  sendTZ();
};

function sendTZ() {
  let myTZ = new Date().toString().match(/\(([A-Za-z\s].*)\)/)[1];  
  let data = {
    key: "zoneCode",
    newValue: myTZ
  }
  console.log(`full date ${new Date()}`);
  console.log(`newValue ${data.newValue}`);
  sendVal(data);
};

// Send data to device using Messaging API
function sendVal(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  }
}

function compressAndTransferImage(settingsValue) {
  const imageData = JSON.parse(settingsValue);
  Image.from(imageData.imageUri)
    .then(image =>
      image.export("image/jpeg", {
        background: "#FFFFFF",
        quality: 40
      })
    )
    .then(buffer => outbox.enqueue(`${Date.now()}.jpg`, buffer))
    .then(fileTransfer => {
      console.log(`Enqueued ${fileTransfer.name}`);
    });
}