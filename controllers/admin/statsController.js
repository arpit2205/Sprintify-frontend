app.run([
  "$rootScope",
  "$location",
  "adminStatsService",
  "toastService",
  function ($rootScope, $location, adminStatsService, toastService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/brand-admin/stats") {
        adminStatsService
          .fetchNumericStats()
          .then(function (data) {
            console.log(data.data.data);
            var data = data.data.data;

            $rootScope.totalUsers =
              data.totalUsersOfABrand[0]?.total_users || 0;
            $rootScope.totalProjects = data.projectCounts[0]?.total || 0;
            $rootScope.completedProjects =
              data.projectCounts[0]?.completed || 0;
            $rootScope.notCompletedProjects =
              data.projectCounts[0]?.not_completed || 0;

            $rootScope.brandProjects = data.projectList;

            var taskCounts = data.taskCountInProjects;

            var k = 0;
            for (var i = 0; i < $rootScope.brandProjects.length; i++) {
              var found = false;
              for (var j = 0; j < taskCounts.length; j++) {
                if ($rootScope.brandProjects[i].title === taskCounts[j]._id) {
                  $rootScope.brandProjects[i].items = taskCounts[j].totalTasks;
                  found = true;
                  break;
                }
              }

              if (!found) {
                $rootScope.brandProjects[i].items = 0;
              }
            }
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast("Error fetching stats", "warning", 3000);
          });
      }
    });
  },
]);

app.controller("adminStatsController", [
  "$scope",
  "$rootScope",
  "loginService",
  "toastService",
  function ($scope, $rootScope, loginService, createUserService, toastService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
      toastService.showToast("Logged out", "success", 3000);
    };
  },
]);
