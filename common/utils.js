// Add zero in front of numbers < 10
export function zeroPad(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

// Remove all quotation marks from a string
export function stripQuotes(str) {
  return str ? str.replace(/"/g, "") : "";
}

//Isolates the filename of the background image
export function myPicString(str) {
  return str.substring(35,str.length - 14);
}

export function MyAmpm(hours) {  
  if (hours > 12) {
    return "PM";
  } else if (hours === 0) {
    return "AM";
  } else if (hours === 12) {
    return "PM";
  } else {
    return "AM";
  } 
}

//get the color without quotes
export function myColor(str) {
  return str.substring(1,str.length - 1);
}

