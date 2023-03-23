angular.module("app").factory("userChartService", [
  function () {
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

        var created = [];
        var completed = [];

        var k = 0;
        var j = 0;

        for (var i = 0; i < dates.length; i++) {
          if (data.weeklyCreatedTasks[k]?._id === dates[i]) {
            created.push(data.weeklyCreatedTasks[k].created_count);
            k++;
          } else {
            created.push(0);
          }

          if (data.weeklyCompletedTasks[j]?._id === dates[i]) {
            completed.push(data.weeklyCompletedTasks[j].completed_count);
            j++;
          } else {
            completed.push(0);
          }
        }

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
          (parseInt(overallData.completed) / parseInt(overallData.total)) * 100;

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
        console.log(data);
        data = data[0];

        var ctx = document.getElementById("task-status-percent-graph");
        var myChart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: ["Todo", "In-progress", "Testing", "Completed"],
            datasets: [
              {
                data: [
                  data.todo,
                  data.inProgress,
                  data.testing,
                  data.completed,
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
    };
  },
]);
