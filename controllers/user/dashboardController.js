app.run([
  "$rootScope",
  "$location",
  "userStatsService",
  "userChartService",
  function ($rootScope, $location, userStatsService, userChartService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/dashboard") {
        $rootScope.task = null;
        $rootScope.comments = null;
        $rootScope.taskLogs = null;

        var project =
          $rootScope.activeProject ||
          JSON.parse(localStorage.getItem("project"));

        if (!project) {
          $location.path("/user/projects");
          return;
        }

        $rootScope.activeProject = project;

        $rootScope.statsLoading = true;

        // fetch backlog stats
        userStatsService
          .fetchWeeklyTaskDigestData($rootScope.activeProject._id)
          .then(function (data) {
            $rootScope.totalTasks =
              data.data.data.percentCompletedTasks[0].total;
            $rootScope.completedTasks =
              data.data.data.percentCompletedTasks[0].completed;
            $rootScope.inProgressTasks =
              $rootScope.totalTasks - $rootScope.completedTasks;
            $rootScope.unassignedTasks =
              data.data.data.unassignedTasksCount[0].count;

            $rootScope.statsLoading = false;

            userChartService.renderWeeklyTaskDigestChart(data.data.data);
            userChartService.renderOverallTaskChart(data.data.data);
            userChartService.renderTaskPercentByStatusChart(
              data.data.data.percentTasksByStatus
            );
            userChartService.renderMostActiveUsersChart(
              data.data.data.fiveMostActiveUsers
            );
          })
          .catch(function (error) {
            console.log(error);
            $rootScope.statsLoading = false;
          });

        // fetch sprint stats
        userStatsService
          .fetchSprintStats($rootScope.activeProject._id)
          .then(function (data) {
            var data = data.data.data[0];

            $rootScope.activeSprints = data.activeSprints[0]?.count || 0;

            $rootScope.completedSprints = data.completedSprints[0]?.count || 0;

            $rootScope.onTimeCompleted = data.onTimeCompleted[0]?.count || 0;

            $rootScope.activeOverdueSprints =
              data.activeOverdueSprints[0]?.count || 0;

            $rootScope.upcomingSprints = data.upcomingSprints[0]?.count || 0;

            userChartService.renderSprintOverduePercentChart(data);
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  },
]);

app.controller("userDashboardController", [
  "$scope",
  "$rootScope",
  "$location",
  "userChartService",
  function ($scope, $rootScope, $location, userChartService) {},
]);
