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