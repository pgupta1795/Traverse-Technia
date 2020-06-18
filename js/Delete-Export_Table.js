deleteTable.onclick = function () {
  if (confirm("Are You Sure?")) {
    chrome.storage.local.set({ "tabTimeObject": "{}" }, function () {
      let table = document.getElementById('timeTable');
      if (table != null) {
        let tableRows = table.getElementsByTagName('tr');
        let rowCount = tableRows.length;
        //fetch tbody and then delete tr elementss
        for (let x = rowCount - 1; x > 0; x--) {
          table.removeChild(tableRows[x]);
        }
      }
      console.log("Deleted");
    });

  }
}

exportTable.onclick = function () {
  let downloadLink;
  let table = document.getElementById("table").firstElementChild;
  let tableExcel = table.getAttribute('id');
  let timeDate = new Date();
  timeDate = timeDate.toLocaleTimeString();
  let name = "TimeReport_" + timeDate;
  if (tableExcel === 'timeTable') {
    let html = table.outerHTML;
    let url = 'data:application/vnd.ms-excel,' + escape(html);

    downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = url;
    downloadLink.download = name;
  } else if (tableExcel === 'chartContainer') {
    timeChart.exportChart({ format: "png", fileName: name });
  } else if (tableExcel === 'pieContainer') {
    pieChart.exportChart({ format: "png", fileName: name });
  } else {
    return;
  }
  //triggering the function
  downloadLink.click();
}