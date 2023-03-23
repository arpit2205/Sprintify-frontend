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

        // fetch stats
        userStatsService
          .fetchWeeklyTaskDigestData($rootScope.activeProject._id)
          .then(function (data) {
            console.log(data.data.data);

            $rootScope.statsLoading = false;

            userChartService.renderWeeklyTaskDigestChart(data.data.data);
            userChartService.renderOverallTaskChart(data.data.data);
            userChartService.renderTaskPercentByStatusChart(
              data.data.data.percentTasksByStatus
            );
          })
          .catch(function (error) {
            console.log(error);
            $rootScope.statsLoading = false;
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
