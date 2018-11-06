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

//Used for the image background
let mySettings = {};
  
//All my options in one array
let myOptions= {timeOrFit: "false",
                OffsetTime: 25,
                batDisp: false,
                color: "white",
                loadZone: "UNK",
                whatTime: "false",
                myScreen: device.modelName
               };

clock.granularity = "minutes";

//loads background image only line 548
loadSettings();

//Load settings from file
loadInfo(myOptions);

//clear the clutter into dual time view line 349
resetToClock(myOptions);

//Update clock face every minute Line 108
clock.ontick = () => updateAll(myOptions);

//Produces clock face
function updateAll(myOptions) {
  loadSettings(); //this is the background image load
  mainClock(myOptions); //Line 130
  myFormCal(); //Line 208
  updateBat(myOptions); //Line 119
  console.log(`myOptions.timeOrFit <${myOptions.timeOrFit}>`);

  //Clear everything except steps or second time  
  allBurn.style.display = "none";
  allAct.style.display = "none";
  allFitID.style.display = "none";
  
  if (myOptions.timeOrFit === "true") {
    console.log("updateAll to updateFitness");
    myUTCTime.style.display = "none";
    resetToSteps(); //Displays steps when activated in fitness mode line 337
  } else {
    console.log("updateAll then utcClock");
    allFeet.style.display = "none";
    resetToClock(myOptions); //Deisplays second clock when activated in dual time mode line 349
    console.log(`Sent to utcClock with time <${myOptions.OffsetTime}>`);
  }
}

//Displays the main time in 12 or 24 hour format
function mainClock(myOptions) {

  let today = new Date();
  let hours = today.getHours();
  let mins = util.zeroPad(today.getMinutes());

  console.log(`hours ${hours}`);
  console.log(`prefs T ${myOptions.whatTime}`); //12 or 24 option
  
  //Force a new timeZone from the companion
  if (Date.now() % 900000 < 100) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send("event");
    }
  } else {
    console.log("don't do it"); 
  }

  if (myOptions.whatTime === "true") {
    //runs if 12 hour clock
    ampm.text = util.MyAmpm(hours);
    ampmShadow.text = util.MyAmpm(hours);
    if (hours > 12) {
      hours = hours - 12;
    }
    ampm.style.display = "inline";
    ampmShadow.style.display = "inline";
    //Adjust font size if font to fill tracker screen better    
    if (hours > 9) {
      if (myOptions.myScreen = "Ionic") {
        time.style.fontSize = 90;
        timeShadow.style.fontSize = 90;        
      } else if (myOptions.myScreen = "Versa") {
        time.style.fontSize = 90;
        timeShadow.style.fontSize = 90;
      } else {
        time.style.fontSize = 100;
        timeShadow.style.fontSize = 100;        
      }
    }
    timeShadow.text = `${hours}:${mins}`;
    time.text = `${hours}:${mins}`;
    //Dynamically calculate where to place AM/PM based on time displayed
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

//Formats the date to my preferred way of seeing it
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
   
  //Offset hours from zulu from settings
  let offsetHours = parseInt(myOptions.OffsetTime);
  
  if (offsetHours === 25) {
    offsetHours = 0;
  }
  
  console.log(`UTC Hours <${UTCHours}>`);
  console.log(`offsetHours <${offsetHours}>`);

  let addedHours = offsetHours + UTCHours; //this will be the display hours variable
  console.log(`addedHours before <${addedHours}>`);
  
  //Correct for outside of 24 hours after zulu offset
  if (addedHours  < 0) {
    addedHours = addedHours + 24;
  } else if (addedHours > 23) {
    addedHours = addedHours - 24;
  }
  
  //Display per 24 hour clock
  if (myOptions.whatTime === "false") {
    lowerAMPM.style.display = "none";
    lowerAMPMShadow.style.display = "none";
    addedHours = util.zeroPad(addedHours);
    myUTCLabel.text = `${addedHours}:${mins}`;
    myUTCLabelShadow.text = `${addedHours}:${mins}`;
  } else {
    //Display 12 hour clock
    lowerAMPM.text = util.MyAmpm(addedHours);
    lowerAMPMShadow.text = util.MyAmpm(addedHours);
    if (addedHours > 12) {
      addedHours = addedHours - 12;
    }
    //Dynamically figure out the end of time for AM/PM placement
    let bboxTime = myUTCLabel.getBBox().right;
    console.log(`bbox width information <${bboxTime}>`);
    lowerAMPM.x = bboxTime + 5;
    lowerAMPMShadow.x = bboxTime + 7;
    lowerAMPMShadow.style.display = "inline";
    lowerAMPM.style.display = "inline";
    myUTCLabel.text = `${addedHours}:${mins}`;
    myUTCLabelShadow.text = `${addedHours}:${mins}`;
  }

  //Display the selected offset from Zulur
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
  //Dynamic placement of icon
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
  //Dynamic placememtn of Icon
  let bboxAct = myAct.getBBox().right;
  console.log(`bbox width information <${bboxAct}>`);
  myActPic.x = bboxAct + 5;
  myActPicShadow.x = bboxAct + 7;

  //Update Calories burned info
  let actCal = today.adjusted.calories;
  myBurn.text = actCal;
  myBurnShadow.text = actCal;
  
  //Dynamic placement of Icon
  let bboxCal = myBurn.getBBox().right;
  console.log(`bbox width information <${bboxCal}>`);
  myBurnPic.x = bboxCal + 5;
  myBurnPicShadow.x = bboxCal + 7;
}

//Update's the reported battery charge for display
function updateBat(myOptions)  {
  let level = battery.chargeLevel;
  console.log(`bat charge <${level}>`);
  console.log(`starting updateBat <${myOptions.batDisp}>`);
  //Adjust percentage to usable size then color code
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

//Reset screen to the dual time
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

//If steps is touched cylce to the secondary display
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

//If the Colories burned is touched, cycle to active minutes
myBurn.onclick = function() {
  allBurn.style.display = "none";
  allAct.style.display = "inline";
  fitID.text = "active minutes";
  fitIDShadow.text = "active minutes";
}
  
//If Active minutes is touched, cycle to steps
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

  try { 
  //Loads default color from file
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
// loadTimeZone
  try {
  //Loads the time zone reported by the sync device
    myOptions.loadZone = fs.readFileSync("zoneCode.txt","ascii");   
    if (myOptions.loadZone !== undefined) {
      console.log(`new Timezone: <${myOptions.loadZone}>`);
      myTZ.text = myOptions.loadZone;
      myTZShadow.text = myOptions.loadZone;
    }
  } catch (error) {
    console.log("No pre-set timezone " + error);
  }         

  try{
  //Loads the selected offset from Zulu to the second time
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

  try{
    //Loads battery display settings
    myOptions.batDisp = fs.readFileSync("batDisp.txt", "ascii");
    if (myOptions.batDisp !== undefined) {
      console.log(`batDisp file read: <${myOptions.batDisp}>`);
    }
  } catch (error) {
      console.log("batDisp not read");
  }

  try{
  //Loads second time or fitness display preference
    myOptions.timeOrFit = fs.readFileSync("timeOrFit.txt", "ascii");
    if (myOptions.timeOrFit !== undefined) {
      console.log(`timeOrFit file read: <${myOptions.timeOrFit}>`);
    }
  } catch (error) {
    console.log("timeOrFit not read");
  }
  
  try{
    //Loads if to override system 12 or 24 clock with user preference
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
  
  updateAll(myOptions); //Actually displays the clock info Line 104
}

//Function to load up the background image if received
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

//Handles any inbound options from settings and saves to loacl file
messaging.peerSocket.onmessage = function (evt) {

  console.log(`onmessage key = <${evt.data.key}>`);
  console.log(`onmsg info = <${evt.data.newValue}>`);
  switch (evt.data.key) {
    case 'color':
      //A new color is received
      let newInfo = util.myColor(evt.data.newValue);
      fs.writeFileSync("myColor.txt",newInfo,"ascii");
      console.log(`myColor file written <${newInfo}>`);
      break;
    case 'offsetTime':
      //A new Zulu offset is selected
      let myTemp = JSON.parse(evt.data.newValue);
      let newInfo = myTemp.values[0].value;
      fs.writeFileSync("offsetTime.txt",newInfo,"ascii");
      console.log(`offsetTime file written <${newInfo}>`);
      break;
    case 'zoneCode':
      //A new timezone was received
      let newInfo = evt.data.newValue;
      fs.writeFileSync("zoneCode.txt", newInfo, "ascii");
      console.log(`zoneCode written <${newInfo}>`);
      break;
    case 'batDisp':
      //Store the option whether to display the battery info or not
      let newInfo = evt.data.newValue;
      fs.writeFileSync("batDisp.txt", newInfo, "ascii");
      console.log(`batDisplay written <${newInfo}>`); 
      break;
    case 'timeOrFit':
      //Store the option to display either second time or fitness
      let newInfo = evt.data.newValue;
      fs.writeFileSync("timeOrFit.txt", newInfo, "ascii");
      console.log(`timeOrFit written <${newInfo}>`); 
      break;
    case 'whatTime':
      //Store if 12 or 24 hour display to loacl file
      let newInfo = evt.data.newValue;
      fs.writeFileSync("whatTime.txt", newInfo, "ascii");
      console.log(`whatTime written <${newInfo}>`);
   }
  //Take saved changes and apply them line 415
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

