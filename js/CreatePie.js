let divPie = document.createElement("div");
divPie.setAttribute('id', 'piediv');
divPie.innerHTML = "<div id=\"pieContainer\" style=\"height: 300px; width: 100%; display:none;\"></div>";
let pieContainer = document.getElementById('pieContainer');
let firstTimePie = true;
let pieChart;


convertToPie.onclick = function () {
  let _host_Time = new Map();

  entries.map(function (urlObject) {
    let url = urlObject["url"];

    if (url != "") {
      let hostURL = new URL(url).host;
      let trackedSec;

      if (_host_Time.has(hostURL)) {
        trackedSec = _host_Time.get(hostURL) + (urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0);
      } else {
        trackedSec = urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;
      }
      _host_Time.set(hostURL, trackedSec);
    }
  });
  if (!firstTimePie) {
    pieContainer.style.display = "";
    if (firstTimeTable) {
      divTable.replaceChild(pieContainer, divTable.childNodes[0]);
    } else {
      divTable.replaceChild(pieContainer, divTable.childNodes[0]);
    }

    return;
  }

  // CanvasJS.addColorSet("techniaShade",
  //   [
  //     "#07b5da", "#f2f2f2"
  //   ]);

  pieChart = new CanvasJS.Chart("pieContainer", {
    title: {
      text: "Time Spent (in min)"
    },
    backgroundColor: "#f2f2f2",
    // colorSet: "techniaShade",
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "pie",
        dataPoints: [
        ]
      }
    ]
  });
  pieChart.render();

  for (const [key, value] of _host_Time.entries()) {
    let url = key;
    let trackedSec = Math.floor(value % 3600 / 60);
    pieChart.data[0].addTo("dataPoints", { label: url, y: trackedSec });
  }


  pieContainer.style.display = "";
  divTable.replaceChild(pieContainer, divTable.childNodes[0]);
  chartContainer.setAttribute("display", "none");
  firstTimePie = false;
}