createTable.onclick = function () {
  if (!firstTimeTable) {
    divTable.replaceChild(timeTable, divTable.childNodes[0]);
    return;
  }

  try {
    if (timeTable.firstElementChild != null)
      timeTable.firstElementChild.style.display = "";

    if (document.getElementById("head") == undefined) {
      let colgrp = document.createElement('colgroup');
      colgrp.setAttribute('style', 'width: 100%;');
      colgrp.innerHTML = '<col span="1" style="width: 60%;"><col span = "1" style = "width: 20%;"><col span="1" style="width: 20%;">';
      timeTable.appendChild(colgrp);

      var th = document.createElement('tr');
      th.setAttribute("id", "head");
      th.appendChild(document.createElement('th'));
      th.appendChild(document.createElement('th'));
      th.appendChild(document.createElement('th'));
      th.cells[0].appendChild(document.createTextNode("URL"));
      th.cells[1].appendChild(document.createTextNode("Active Time"));
      th.cells[2].appendChild(document.createTextNode("Last Visited"));
      timeTable.appendChild(th);
    }

    //Add Rows one by one
    entries.map(function (urlObject) {
      let url = urlObject["url"];
      if (url != "") {
        let trackedSec = secondsToHms(urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0);
        let lastVisited = new Date();
        lastVisited.setTime(urlObject["lastDateVal"] != null ? urlObject["lastDateVal"] : 0);
        lastVisited = lastVisited.toLocaleString();

        var tr = document.createElement('tr');
        tr.setAttribute('id', 'row');

        tr.appendChild(document.createElement('td'));
        tr.appendChild(document.createElement('td'));
        tr.appendChild(document.createElement('td'));

        tr.cells[0].appendChild(document.createTextNode(url));
        tr.cells[1].appendChild(document.createTextNode(trackedSec));
        tr.cells[2].appendChild(document.createTextNode(lastVisited));
        tr.cells[0].setAttribute('id', 'urlColumn');
        tr.cells[0].setAttribute('class', 'urlColumn');
        tr.cells[0].innerHTML = '<a href="' + url + '" target="_blank" id="url">' + url + '</a>';
        timeTable.appendChild(tr);
      }
    });
    divTable.appendChild(timeTable);
    divTable.replaceChild(timeTable, divTable.childNodes[0]);
    firstTimeTable = false;

  } catch (error) {
    console.log(error);
  }
  // });
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
