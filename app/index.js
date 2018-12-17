import document from "document";
import clock from "clock";
import * as messaging from "messaging";
import * as util from "../common/utils";
import * as fs from "fs";

import { inbox } from "file-transfer";
import { today } from 'user-activity';
import { preferences } from "user-settings";

import { me } from "appbit";
import { display } from "display";
import { battery } from "power";

import {me as device} from "device";


let myColor = document.getElementById("myColor");

// Main Clock elements
let mainTime = document.getElementById("mainTime");
let time = document.getElementById("time");
let timeShadow = document.getElementById("timeShadow");
let ampm = document.getElementById("ampm");
let ampmShadow = document.getElementById("ampmShadow");
let myTZShadow = document.getElementById("myTZShadaow");
let myTZ = document.getElementById("myTZ");

//Zulu Clock Elements
let myUTCTime = document.getElementById("myUTCTime");
let myUTCLabel = document.getElementById("myUTCLabel");
let myUTCLabelShadow = document.getElementById("myUTCLabelShadow");
let myZShadow = document.getElementById("myZShadow");
let myZ = document.getElementById("myZ");
let lowerAMPMShadow = document.getElementById("lowerAMPMShadow");
let lowerAMPM = document.getElementById("lowerAMPM");

//Calendaer elements
let allCal = document.getElementById("allCal");
let myCal = document.getElementById("myCal");
let myCalShadow = document.getElementById("myCalShadow");

//Step Count elements
let allFeet = document.getElementById("allFeet");
let mySteps = document.getElementById("mySteps");
let myStepsShadow = document.getElementById("myStepsShadow");
let myFeet = document.getElementById("myFeet");
let myFeetShadow = document.getElementById("myFeetShadow");

//Fitness Fill Elements
let allAct = document.getElementById("allAct");
let myAct = document.getElementById("myAct");
let myActShadow = document.getElementById("myActShadow");
let myActPic = document.getElementById("myActPic");
let myActPicShadow = document.getElementById("myActPicShadow");

let allBurn = document.getElementById("allBurn");
let myBurn = document.getElementById("myBurn");
let myBurnShadow = document.getElementById("myBurnShadow");
let myBurnPic = document.getElementById("myBurnPic");
let myBurnPicShadow = document.getElementById("myBurnPicShadow");

let allFitID = document.getElementById("allFitID");
let fitID = document.getElementById("fitID");
let fitIDShadow = document.getElementById("fitIDShadow");

//Batery fill elements
let batShell = document.getElementById("batShell");
let batt = document.getElementById("batt");

let batBody = document.getElementById("batBody");
let batFill = document.getElementById("batFill");
let batFillWidth = batBody.width - 4;

const SETTINGS_FILE = "settings.cbor";
const SETTINGS_TYPE = "cbor";

const imageBackground = document.getElementById("imageBackground");

let mySettings = {};
  
let myOptions= {timeOrFit: "false",
                OffsetTime: 25,
                batDisp: false,
                color: "white",
                loadZone: "UNK",
                whatTime: "false",
                myScreen: device.modelName
               };

console.log(`myScreen device type is <${myOptions.myScreen}>`);

clock.granularity = "minutes";

//loads background image only
loadSettings();

//See if there are saved settings
loadInfo(myOptions);

//clear the clutter
resetToClock(myOptions);


//produces clock face called by loadInfo
function updateAll(myOptions) {
//  loadSettings(); //this is the background image load
  mainClock(myOptions);
  myFormCal();
  updateBat(myOptions);
  console.log(`myOptions.timeOrFit <${myOptions.timeOrFit}>`);

  //Clear everything except steps or second time  
  allBurn.style.display = "none";
  allAct.style.display = "none";
  allFitID.style.display = "none";
  
  if (myOptions.timeOrFit === "true") {
    console.log("updateAll to updateFitness");
    myUTCTime.style.display = "none";
    resetToSteps();
  } else {
    console.log("updateAll then utcClock");
    allFeet.style.display = "none";
    resetToClock(myOptions);
    console.log(`Sent to utcClock with time <${myOptions.OffsetTime}>`);
  }
}

function mainClock(myOptions) {

  let today = new Date();
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());

  console.log(`hours ${hours}`);
  console.log(`prefs T ${myOptions.whatTime}`);
  
  //Force a new timeZone from the companion
  //Force a new timeZone from the companion
  if (Date.now() % 900000 < 100) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send("event");
    } else {
      timeZone = "Unknown";
    }
  } else {
    console.log("don't do it"); 
  }
  
  if (myOptions.whatTime === "true") {
    ampm.text = util.MyAmpm(hours);
    ampmShadow.text = util.MyAmpm(hours);
    if (hours > 12) {
      hours = hours - 12;
    }
    ampm.style.display = "inline";
    ampmShadow.style.display = "inline";
    if (hours > 9) {
      if (myOptions.myScreen = "Ionic") {
        time.style.fontSize = 90;
        timeShadow.style.fontSize = 90;        
      } else if (myOptions.myScreen = "Versa") {
        time.style.fontSize = 80;
        timeShadow.style.fontSize = 90;
      } else {
        time.style.fontSize = 100;
        timeShadow.style.fontSize = 100;        
      }
    }
    timeShadow.text = `${hours}:${mins}`;
    time.text = `${hours}:${mins}`;
    let bboxTime = time.getBBox().right;
    console.log(`bbox width information <${bboxTime}>`);
    ampm.x = bboxTime + 5;
    ampmShadow.x = bboxTime + 7;
  } else {
    ampm.style.display = "none";
    ampmShadow.style.display = "none";
    hours = util.zeroPad(today.getHours());
    timeShadow.text = `${hours}:${mins}`;
    time.text = `${hours}:${mins}`;
  };

};

function formatDate(date) {
   var monthNames = [
    "Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
   var dayNames = [
    "Sun", "Mon", "Tues", "Weds", "Thurs", "Fri", "Sat"
  ];  
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var todayIndex = date.getDay();
  
  lowerAMPMShadow.style.display = "none";
  lowerAMPM.style.display = "none";
  
  return dayNames[todayIndex] + ', ' + day + ' ' + monthNames[monthIndex];
}

// Uses formatDate function to display my date
function myFormCal()  {
  myCal.text = `${formatDate(new Date())}`;
  myCalShadow.text = `${formatDate(new Date())}`;
}  


//Update the text element of myUTCLabel with UTC Time
function utcClock(myOptions) {
  let today = new Date(); 
  let mins = util.zeroPad(today.getMinutes()); 
  let UTCHours = today.getUTCHours(); 
  let myAMPM;
   
  let offsetHours = parseInt(myOptions.OffsetTime);
  
  if (offsetHours === 25) {
    offsetHours = 0;
  }
  
  console.log(`UTC Hours <${UTCHours}>`);
  console.log(`offsetHours <${offsetHours}>`);

  let addedHours = offsetHours + UTCHours; //this will be the display hours variable
  console.log(`addedHours before <${addedHours}>`);
  
  if (addedHours  < 0) {
    addedHours = addedHours + 24;
  } else if (addedHours > 23) {
    addedHours = addedHours - 24;
  }

  console.log(`addedHours after <${addedHours}>`);
  
  if (myOptions.whatTime === "false") {
    lowerAMPM.style.display = "none";
    lowerAMPMShadow.style.display = "none";
    addedHours = util.zeroPad(addedHours);
    myUTCLabel.text = `${addedHours}:${mins}`;
    myUTCLabelShadow.text = `${addedHours}:${mins}`;
  } else {
    if (addedHours > 12) {
      myAMPM = "PM";
      addedHours = addedHours - 12;
    } else if (addedHours < 12) {
      myAMPM = "AM";
    } else if (addedHours === 12) {
      myAMPM = "PM";
    } else if (addedHours === 0) {
      myAMPM = "AM";
    } else {
      console.log("myAMPM is undefined");
    }
    lowerAMPM.text = `${myAMPM}`;
    lowerAMPMShadow.text = `${myAMPM}`;
    let bboxTime = myUTCLabel.getBBox().right;
    console.log(`bbox width information <${bboxTime}>`);
    lowerAMPM.x = bboxTime + 5;
    lowerAMPMShadow.x = bboxTime + 7;
    lowerAMPMShadow.style.display = "inline";
    lowerAMPM.style.display = "inline";
    myUTCLabel.text = `${addedHours}:${mins}`;
    myUTCLabelShadow.text = `${addedHours}:${mins}`;
  }
  
  if (offsetHours > 0) {
    myZ.text = `GMT +${offsetHours} Selected`;
    myZShadow.text = `GMT +${offsetHours} Selected`;
  } else if (offsetHours < 0) {
    myZ.text = `GMT ${offsetHours} Selected`;
    myZShadow.text = `GMT ${offsetHours} Selected`;
  } else if (offsetHours === 0) {
    myZ.text = `GMT Selected`;
    myZShadow.text = `GMT Selected`;
  } else {
    console.log("GMT undefined");
  }   
}


// Function that uses the information from the import { today } from above and assigns it to the text element
function updateSteps() {
  let stepCt = today.adjusted.steps;
  mySteps.text=stepCt;
  myStepsShadow.text=stepCt;
  let bboxStep = mySteps.getBBox().right;
  console.log(`bbox width information <${bboxStep}>`);
  myFeet.x = bboxStep + 5;
  myFeetShadow.x = bboxStep + 7;
}

// Function to update fitness only items
function updateFitness() {
  //Update Active minutes info
  let actMin = today.adjusted.activeMinutes;
  myAct.text=actMin;
  myActShadow.text=actMin; 
  
  let bboxAct = myAct.getBBox().right;
  console.log(`bbox width information <${bboxAct}>`);
  myActPic.x = bboxAct + 5;
  myActPicShadow.x = bboxAct + 7;

  //Update Calories burned info
  let actCal = today.adjusted.calories;
  myBurn.text = actCal;
  myBurnShadow.text = actCal;
  
  let bboxCal = myBurn.getBBox().right;
  console.log(`bbox width information <${bboxCal}>`);
  myBurnPic.x = bboxCal + 5;
  myBurnPicShadow.x = bboxCal + 7;
}


function updateBat(myOptions)  {
  let level = battery.chargeLevel;
  console.log(`bat charge <${level}>`);
  console.log(`starting updateBat <${myOptions.batDisp}>`);
  batFill.width = Math.floor(batFillWidth * level / 100);
  if (myOptions.batDisp === "true" && batFill.width >= 6) {
    console.log("batDisp = true");
    if (batFill.width > 6) {
      batt.style.display = "inline";
      if (batFill.width < 11) {
        batFill.style.fill = "yellow";
      } else {
      batFill.style.fill = "green";
      }
    }
  } else {
    batt.style.display = "none";
  }
}

//reset the screen when an option is changed
function resetToSteps() {
  myUTCTime.style.display = "none";
  allBurn.style.display = "none";   
  allAct.style.display = "none";
  updateSteps();
  allFeet.style.display = "inline"; 
  fitID.text = "steps";
  fitIDShadow.text = "steps";
  allFitID.style.display = "inline";
}

function resetToClock(myOptions){
  allBurn.style.display = "none";   
  allAct.style.display = "none";
  allFitID.style.display = "none";
  allFeet.style.display = "none";
  myUTCTime.style.display = "inline";
  
  if (myOptions.OffsetTime === undefined) {
    myOptions.OffsetTime = 25
  };
  console.log("Sent to utcClock");
  utcClock(myOptions);
}

//Begin the touches

//If myUTC is touched, hide it and display steps
myUTCLabel.onclick = function()  {
  myUTCTime.style.display = "none";

  //get a recent count.  Screen is only active for 5 seconds, so no need to ontiuously updated
  updateSteps();
  allFeet.style.display = "inline";
  fitID.text = "steps";
  fitIDShadow.text = "steps";
  allFitID.style.display = "inline";
}

//if steps is touched cylce to the secondary display
mySteps.onclick = function()  {
  allFeet.style.display = "none";
  if (myOptions.timeOrFit === "false") {
    console.log("back to UTC");
    resetToClock(myOptions);
  } else {
    updateFitness();
    allFeet.style.display = "none";
    allBurn.style.display = "inline";
    fitID.text = "calories";
    fitIDShadow.text = "calories";
    allFitID.style.display = "inline";
  }
}

myBurn.onclick = function() {
  allBurn.style.display = "none";
  allAct.style.display = "inline";
  fitID.text = "active minutes";
  fitIDShadow.text = "active minutes";
}
  
myAct.onclick = function() {
  allAct.style.display = "none";
  //Get new steps and display them
  updateSteps();
  allFeet.style.display = "inline"
  fitID.text = "steps";
  fitIDShadow.text = "steps";
}

// Read all the different settings from file, apply them and save into myOptions
function loadInfo(myOptions) {
//function loadColor()
  try { 
    myOptions.color = fs.readFileSync("myColor.txt","ascii");
    let loadColor = myOptions.color;
    console.log("Orgional loadColor read " + loadColor);
    if (loadColor !== undefined) {
      myColor.style.fill = loadColor; 
      console.log("loadColor entered on this try");
    }
  } catch (error) {
    console.log("loadColor error " + error);
    if (loadColor !== undefined) {
      //on first run-through there are still quotes on the color
      console.log("loadColor " + loadColor);
      if (loadColor.substring(0) === '"') {
        loadColor = util.myColor(loadColor);
        console.log("Refined loadColor <" + loadColor + ">");
      } else {
        loadColor = "white";
      }
      myColor.style.fill = loadColor; 
    }
  }
// loadTimeZone()
  try {
    myOptions.loadZone = fs.readFileSync("zoneCode.txt","ascii");   
    if (myOptions.loadZone !== undefined) {
      console.log(`new Timezone: <${myOptions.loadZone}>`);
      myTZ.text = myOptions.loadZone;
      myTZShadow.text = myOptions.loadZone;
    }
  } catch (error) {
    console.log("No pre-set timezone " + error);
      myTZ.text = "Unknown";
      myTZShadow.text = "Unknown";
  }         

// loadOffset()
  try{
    myOptions.OffsetTime = util.stripQuotes(fs.readFileSync("offsetTime.txt","ascii")); 
    if (myOptions.OffsetTime !== undefined) {
      console.log(`new Offset: <${myOptions.OffsetTime}>`);
    } else if (myOptions.OffsetTime === undefined) {
      myOptions.OffsetTime = 25;
    }  
  } catch (error) {
    console.log("No pre-set offset" + error);
    myOptions.OffsetTime = 25; 
  }
//load battery display settings
  try{
    myOptions.batDisp = fs.readFileSync("batDisp.txt", "ascii");
    if (myOptions.batDisp !== undefined) {
      console.log(`batDisp file read: <${myOptions.batDisp}>`);
    }
  } catch (error) {
      console.log("batDisp not read");
  }
//load second time or fitness display
  try{
    myOptions.timeOrFit = fs.readFileSync("timeOrFit.txt", "ascii");
    if (myOptions.timeOrFit !== undefined) {
      console.log(`timeOrFit file read: <${myOptions.timeOrFit}>`);
    }
  } catch (error) {
    console.log("timeOrFit not read");
  }
  try{
    myOptions.whatTime = fs.readFileSync("whatTime.txt", "ascii");
    if (myOptions.whatTime !== undefined) {
      console.log(`whatTime file read: <${myOptions.whatTime}>`);
    }  
  } catch (error) {
      console.log("whatTime not read, assigned system");
     if (preferences.clockDisplay === "24h"){
       myOptions.whatTime = "false";
     } else {
       myOptions.whatTime = "true";
     }
  }
  updateAll(myOptions);
}

inbox.onnewfile = () => {
  let fileName;
  do {
    fileName = inbox.nextFile();
    if (fileName) {
      if (mySettings.bg && mySettings.bg !== "" && mySettings.bg !== "brushed.jpeg") {
        fs.unlinkSync(mySettings.bg);
      }
      mySettings.bg = `/private/data/${fileName}`;
      saveSettings();
      applySettings();
    }
  } while (fileName);
};

messaging.peerSocket.onmessage = function (evt) {

  console.log(`onmessage key = <${evt.data.key}>`);
  console.log(`onmsg info = <${evt.data.newValue}>`);
  switch (evt.data.key) {
    case 'color':
      let newInfo = util.myColor(evt.data.newValue);
      fs.writeFileSync("myColor.txt",newInfo,"ascii");
      console.log(`myColor file written <${newInfo}>`);
      break;
    case 'offsetTime':
      let myTemp = JSON.parse(evt.data.newValue);
      let newInfo = myTemp.values[0].value;
      fs.writeFileSync("offsetTime.txt",newInfo,"ascii");
      console.log(`offsetTime file written <${newInfo}>`);
      break;
    case 'zoneCode':
      let newInfo = evt.data.newValue;
      fs.writeFileSync("zoneCode.txt", newInfo, "ascii");
      console.log(`zoneCode written <${newInfo}>`);
      break;
    case 'batDisp':
      let newInfo = evt.data.newValue;
      fs.writeFileSync("batDisp.txt", newInfo, "ascii");
      console.log(`batDisplay written <${newInfo}>`); 
      break;
    case 'timeOrFit':
      let newInfo = evt.data.newValue;
      fs.writeFileSync("timeOrFit.txt", newInfo, "ascii");
      console.log(`timeOrFit written <${newInfo}>`); 
      break;
    case 'whatTime':
      let newInfo = evt.data.newValue;
      fs.writeFileSync("whatTime.txt", newInfo, "ascii");
      console.log(`whatTime written <${newInfo}>`);
   }
  updateSteps();
  resetToSteps();
  loadInfo(myOptions);
};   

function loadSettings() {
  try {
    mySettings = fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
    } catch (error) {
      mySettings = {bg: "brushed.jpeg"};
      console.log("pic error " + error);
    }
    applySettings();
  }

function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, mySettings, SETTINGS_TYPE);
}

function applySettings() {
  if (mySettings.bg) {
    imageBackground.image = mySettings.bg;
  } else {
    imageBackground.image = "brushed.jpeg";
  }
  display.on = true;
}

//loadInfo calls from file to load clock
clock.ontick = () => updateAll(myOptions);
