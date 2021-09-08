import { useMemo } from "react";
import { chartOptions, parseOptions } from "../../variables/charts.js";
import { Line } from "react-chartjs-2";
import {
  getFormattedDate,
  getFormattedNumber,
} from "../../utils/formatters.js";
import { toFraction } from "../../utils/balance.js";

const lineChartOptions = {
  width: 100,
  hover: {
    intersect: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          callback: function (label, index, labels) {
            if (index % 24 == 5) {
              return getFormattedDate(label);
            }
          },
          maxTicksLimit: 100,
          maxRotation: 0,
          minRotation: 0,
        },
      },
    ],
    yAxes: [
      {
        position: "right",
        ticks: {
          display: true,
          beginAtZero: true,
          maxTicksLimit: 6,
        },
        gridLines: {
          display: false,
          drawBorder: false,
          //   color: "rgba(47, 54, 65, 0.24)",
          //   dashOffset: 10,
          //   tickBorderDash: 100,
        },
      },
    ],
  },
  tooltips: {
    // custom: function (tooltip) {
    //   if (!tooltip) return;
    //   // disable displaying the color box;
    //   tooltip.displayColors = false;
    // },
    callbacks: {
      label: function (item) {
        return getFormattedNumber(item.yLabel);
      },
      title: function (item) {
        return getFormattedDate(item[0].label, true);
      },
    },
  },
};

let width, height, gradient;

function getGradient(ctx, chartArea) {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (gradient === null || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(1, "rgba(0, 204, 106, 0.4)");
    gradient.addColorStop(0, "rgba(26, 32, 41, 0)");
  }

  return gradient;
}

const PriceChart = ({ snapshots }) => {
  if (typeof window !== "undefined" && window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const lineChartData = useMemo(
    (canvas) => {
      //   const ctx = canvas.getContext("2d"),
      //     gradient = ctx.createLinearGradient(0, 0, 0, 400);

      //   gradient.addColorStop(0, "rgba(0, 0,255, 0.5)");
      //   gradient.addColorStop(0.5, "rgba(0, 0, 255, 0.25)");
      //   gradient.addColorStop(1, "rgba(0, 0, 255, 0)");

      const labels = [],
        data = [];

      const length = snapshots.length;

      for (let i = 0; i < length; i++) {
        const date = new Date(snapshots[i].date * 1000);

        labels.push(date);
        data.push(toFraction(snapshots[i].totalStakingVolume));
      }

      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: function (context) {
              const chart = context.chart;
              const { ctx, chartArea } = chart;

              if (!chartArea) {
                // This case happens on initial chart load
                return null;
              }
              return getGradient(ctx, chartArea);
            },
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(23,43,77,0.5)",
            pointHoverBorderWidth: 2,
            lineTension: 0,
            fill: "start",
            borderColor: "#1AD37A",
          },
        ],
      };
    },
    [snapshots]
  );

  return (
    <Line
      data={lineChartData}
      options={lineChartOptions}
      className="chart-canvas"
    />
  );
};

export default PriceChart;
