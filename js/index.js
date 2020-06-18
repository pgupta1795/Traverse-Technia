// author - Pallav Gupta
// Email - pgupta1795@gmail.com
let divTable = document.getElementById("table");
let timeTable = document.createElement('table');
timeTable.setAttribute('border', '1px');
timeTable.setAttribute('id', 'timeTable');
let createTable = document.getElementById("trackButton");
let deleteTable = document.getElementById("deleteButton");
let exportTable = document.getElementById("export");
let convertToChart = document.getElementById("convertToChart");
let convertToPie = document.getElementById("convertToPie");

let firstTimeTable = true;
let entries = [];

chrome.storage.local.get("tabTimeObject", function (tableContent) {
  let tableDataString = tableContent["tabTimeObject"];
  console.log("TABLE data string : " + tableDataString);
  if (tableDataString == null) {
    return;
  }
  let data = JSON.parse(tableDataString);
  timeTable.style.display = "";
  //take data from local storage variable
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      entries.push(data[key]);
    }
  }
  //sort it according to tracked time
  entries.sort(function (time1, time2) {
    let t1 = time1["trackedSeconds"];
    let t2 = time2["trackedSeconds"];
    return t2 - t1;
  });
});