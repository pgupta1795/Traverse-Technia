// let divChart = document.createElement("div");
// divChart.setAttribute('id', 'chartdiv');
// divChart.innerHTML = "<div id=\"chartContainer\" style=\"height: 300px; width: 100%; display:none;\"></div>";
let chartContainer = document.getElementById('chartContainer');
let firstTimeChart = true;
let timeChart;


convertToChart.onclick = function () {
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


  if (!firstTimeChart) {
    chartContainer.style.display = "";
    if (firstTimeTable) {
      divTable.replaceChild(chartContainer, divTable.childNodes[0]);
    } else {
      divTable.replaceChild(chartContainer, divTable.childNodes[0]);
    }
    return;
  }

  CanvasJS.addColorSet("techniaShade",
    [
      "#07b5da"
    ]);

  timeChart = new CanvasJS.Chart("chartContainer", {
    title: {
      text: "Time Spent (in min)"
    },
    backgroundColor: "#f2f2f2",
    colorSet: "techniaShade",
    data: [
      {
        // Change type to "doughnut", "line", "splineArea", etc.
        type: "column",
        dataPoints: [
        ]
      }
    ]
  });
  timeChart.render();

  for (const [key, value] of _host_Time.entries()) {
    let url = key;
    let trackedSec = Math.floor(value % 3600 / 60);
    timeChart.data[0].addTo("dataPoints", { label: url, y: trackedSec });
  }

  chartContainer.style.display = "";
  divTable.replaceChild(chartContainer, divTable.childNodes[0]);
  pieContainer.setAttribute("display", "none");
  firstTimeChart = false;
}