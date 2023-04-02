angular.module("app").factory("userChartService", [
  "$rootScope",
  function ($rootScope) {
    return {
      renderWeeklyTaskDigestChart: function (data) {
        const today = new Date();
        const dates = [];
        for (let i = 0; i < 7; i++) {
          const date = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - 6 + i
          );
          const formattedDate = `${date
            .getDate()
            .toString()
            .padStart(2, "0")}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
          dates.push(formattedDate);
        }

        console.log(data);
        console.log(dates);

        var created = [];
        var completed = [];

        var k = 0;
        var j = 0;

        for (var i = 0; i < dates.length; i++) {
          for (var j = 0; j < data.weeklyCreatedTasks.length; j++) {
            var found = false;
            if (dates[i] === data.weeklyCreatedTasks[j]?._id) {
              created.push(data.weeklyCreatedTasks[j].created_count);
              found = true;
              break;
            }
          }

          if (!found) {
            created.push(0);
          }
        }

        for (var i = 0; i < dates.length; i++) {
          for (var j = 0; j < data.weeklyCompletedTasks.length; j++) {
            var found = false;
            if (dates[i] === data.weeklyCompletedTasks[j]?._id) {
              completed.push(data.weeklyCompletedTasks[j].completed_count);
              found = true;
              break;
            }
          }

          if (!found) {
            completed.push(0);
          }
        }

        console.log(created, completed);

        new Chart("weekly-task-stats-graph", {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Tasks created",
                data: created,
                borderColor: "#0052cc",
                backgroundColor: "#0052cc",
                fill: false,
                borderWidth: 4,
              },
              {
                label: "Tasks completed",
                data: completed,
                borderColor: "#36b37e",
                backgroundColor: "#36b37e",
                fill: false,
                borderWidth: 4,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },

      renderOverallTaskChart: function (data) {
        var overallData = data.percentCompletedTasks[0];

        var percentComplete =
          (parseInt(overallData?.completed) / parseInt(overallData?.total)) *
          100;

        var ctx = document.getElementById("overall-task-graph");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Completed", "Todo"],
            datasets: [
              {
                data: [percentComplete, 100 - percentComplete],
                backgroundColor: ["#0052cc", "rgba(0, 82, 204, 0.1)"],
                borderColor: ["#0052cc", "rgba(0, 82, 204, 0.1)"],
                borderWidth: 1,
              },
            ],
          },
          options: {},
        });
      },

      renderTaskPercentByStatusChart: function (data) {
        data = data[0];

        var ctx = document.getElementById("task-status-percent-graph");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Todo", "In-progress", "Testing", "Completed"],
            datasets: [
              {
                data: [
                  data?.todo,
                  data?.inProgress,
                  data?.testing,
                  data?.completed,
                ],
                backgroundColor: ["#172b4d", "#0052cc", "#ffab00", "#36b37e"],
                borderColor: ["#172b4d", "#0052cc", "#ffab00", "#36b37e"],
                borderWidth: 1,
              },
            ],
          },
          options: {},
        });
      },

      renderMostActiveUsersChart: function (data) {
        var labels = [],
          value = [];

        for (var i = 0; i < data.length; i++) {
          labels.push(data[i]._id);
          value.push(data[i].count);
        }

        var ctx = document.getElementById("most-active-users-graph");
        var myChart = new Chart(ctx, {
          type: "horizontalBar",
          data: {
            labels: labels,
            datasets: [
              {
                axis: "y",
                label: "Activities",
                data: value,
                fill: false,
                backgroundColor: [
                  "#36b37e",
                  "#0052cc",
                  "#6554c0",
                  "#172b4d",
                  "#ffab00",
                ],
                borderColor: [
                  "#36b37e",
                  "#0052cc",
                  "#6554c0",
                  "#172b4d",
                  "#ffab00",
                ],
                borderWidth: 1,
                barThickness: 40,
                borderRadius: 15,
              },
            ],
          },
          options: {
            indexAxis: "y",
            beginAtZero: true,

            scales: {
              xAxes: [
                {
                  display: true,
                  ticks: {
                    beginAtZero: true,
                  },
                  gridLines: {
                    display: false,
                  },
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          },
        });
      },

      // sprints
      renderSprintOverduePercentChart: function (data) {
        var completedOverdueSprints = parseInt(
          data.completedOverdueSprints[0]?.count || 0
        );
        var onTimeCompletedSprints = parseInt(
          data.onTimeCompleted[0]?.count || 0
        );

        var onTimeCompletedPercent = parseInt(
          (onTimeCompletedSprints /
            (onTimeCompletedSprints + completedOverdueSprints)) *
            100
        );

        console.log("overdue", data.completedOverdueSprints[0]?.count);
        console.log("ontime", data.onTimeCompleted[0]?.count);

        $rootScope.sprintCompletionLikely =
          onTimeCompletedPercent < 25
            ? "very less"
            : onTimeCompletedPercent < 50
            ? "less"
            : onTimeCompletedPercent < 75
            ? "moderately"
            : onTimeCompletedPercent < 90
            ? "highly"
            : "strongly";

        var ctx = document.getElementById("sprint-percent-graph");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["On-time", "Overdue"],
            datasets: [
              {
                data: onTimeCompletedPercent
                  ? [onTimeCompletedPercent, 100 - onTimeCompletedPercent]
                  : [0, 0],
                backgroundColor: ["#6554c0", "#ff5630"],
                borderColor: ["#6554c0", "#ff5630"],
                borderWidth: 1,
              },
            ],
          },
          options: {},
        });
      },
    };
  },
]);
