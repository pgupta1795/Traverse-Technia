// author - @Pallav Gupta
// Email - pallav.gupta@technia.com

let createTable = document.getElementById("trackButton");
let deleteTable = document.getElementById("deleteButton");
let timeTable = document.getElementById("timeTable");

deleteTable.onclick = function () {
  if (confirm("Are You Sure?")) {
    chrome.storage.local.set({ "tabTimeObject": "{}" }, function () {
      var elmtTable = document.getElementById('timeTable').childNodes[0];
      var tableRows = elmtTable.getElementsByTagName('tr');
      var rowCount = tableRows.length;
      //fetch tbody and then delete tr elementss
      for (var x = rowCount - 1; x > 0; x--) {
        elmtTable.removeChild(tableRows[x]);
      }
      console.log("Deleted");
    });

  }
}

createTable.onclick = function () {
  chrome.storage.local.get("tabTimeObject", function (tableContent) {
    let tableDataString = tableContent["tabTimeObject"];
    console.log("TABLE data string : " + tableDataString);
    if (tableDataString == null) {
      return;
    }

    try {
      let data = JSON.parse(tableDataString);

      //delete all current table rows and create table from scratch
      for (let i = 0; i < (timeTable.rows.length) - 1; i++) {
        timeTable.deleteRow();
      }
      //take data from local storage variable
      let entries = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          entries.push(data[key]);
        }
      }
      //sort it according to tracked time
      entries.sort(function (time1, time2) {
        let t1 = time1["trackedSeconds"];
        let t2 = time2["trackedSeconds"];
        return t1 - t2;
      });

      if (document.getElementById("head") == undefined) {
        let headerRow = timeTable.insertRow(0);
        headerRow.setAttribute("id", "head");
        headerRow.insertCell(0).innerHTML = "<b>URL<b>";
        headerRow.insertCell(1).innerHTML = "<b>Active Time<b>";
        headerRow.insertCell(2).innerHTML = "<b>Last Visited<b>";
      }

      //Add Rows one by one
      entries.map(function (urlObject) {
        let url = urlObject["url"];
        if (url != "") {
          let newRow = timeTable.insertRow(1);
          newRow.setAttribute("id", "row");
          newRow.insertCell(0).innerHTML = '<a href="' + url + '"target="_blank" id="url">' + url + '</a>';
          let trackedSec = urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;
          newRow.insertCell(1).innerHTML = secondsToHms(trackedSec);
          let lastVisited = new Date()
          lastVisited.setTime(urlObject["lastDateVal"] != null ? urlObject["lastDateVal"] : 0);
          newRow.insertCell(2).innerHTML = lastVisited.toLocaleString();
          console.log("ROW added : " + newRow);
        }
      });

      document.getElementById('deleteButton').style.display = "";
      document.getElementById('export').style.display = "";


    } catch (error) {
      console.log(error);
    }
  });
}

function secondsToHms(trackedSec) {
  trackedSec = Number(trackedSec);
  let h = Math.floor(trackedSec / 3600);
  let m = Math.floor(trackedSec % 3600 / 60);
  let s = Math.floor(trackedSec % 3600 % 60);

  let hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  let mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
  let sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : (trackedSec + "sec");
  return hDisplay + mDisplay + sDisplay;
}

document.getElementById("export").addEventListener("click", exportTableToExcel);

function exportTableToExcel() {
  let downloadLink;
  let table = document.getElementById("timeTable");
  let html = table.outerHTML;
  let url = 'data:application/vnd.ms-excel,' + escape(html);

  downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  downloadLink.href = url;
  downloadLink.download = "TimeReport.xls";
  //triggering the function
  downloadLink.click();
}

//Below Code is from TechniaTranscatJiraExtension
let jiraIssue;
const baseURL = "https://technia.jira.com/browse/";

function runner() {
  let jiraIssueInput = document.getElementById('jiraIssue');

  if (jiraIssueInput.value) {
    jiraIssue = jiraIssueInput.value.trim();
  }
  let jiraAttr = setJiraAttr(jiraIssue);
  let project = jiraAttr.group;
  let ticketNumber = jiraAttr.number;

  if (project && ticketNumber) {
    event.preventDefault();

    chrome.tabs.create({
      url: baseURL + project + '-' + ticketNumber
    });
  } else {
    event.preventDefault();

    chrome.tabs.create({
      url: 'https://technia.jira.com/secure/Dashboard.jspa'
    });
  }
}

function setJiraAttr(jiraIssue) {
  var project, ticketNumber, jiraArray;
  if (/^[A-z]+-[0-9]+$/.test(jiraIssue)) {
    jiraArray = jiraIssue.split("-", 2);
    project = jiraArray[0];
    ticketNumber = jiraArray[1];
    localStorage.setItem('project', project);
    localStorage.setItem('ticketNumber', ticketNumber);
  } else if (/^[0-9]+$/.test(jiraIssue)) {
    project = localStorage.getItem('project');
    ticketNumber = jiraIssue;
    localStorage.setItem('ticketNumber', ticketNumber);
  } else {
    project = localStorage.getItem('project');
    ticketNumber = localStorage.getItem('ticketNumber');;
  }
  return {
    group: project,
    number: ticketNumber
  };
}

function checkLoginStatus(callback) {
  ajax('GET', 'https://technia.jira.com/rest/auth/1/session', {
    load: function () {
      let status = this.status;
      let data = JSON.parse(this.responseText);
      if (status === 200) {
        callback(data.name);
      } else {
        document.getElementById('search').style.visibility = "hidden";
        let element = document.getElementsByClassName("body")[0];
        element.className += " errorAlert";
      }
    }
  });
}

function ajax(type, url, data, callbacks = {}) {
  if (type === 'GET' && !Object.keys(callbacks).length) {
    callbacks = data;
  }
  let req = new XMLHttpRequest();
  for (let event in callbacks) {
    if (callbacks.hasOwnProperty(event)) {
      req.addEventListener(event, callbacks[event]);
    }
  }
  req.open(type, url);
  req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  req.send(data);
}


window.addEventListener('load', function () {
  checkLoginStatus(function (user) {
    document.getElementById('runner').addEventListener('submit', runner);
  });
});
