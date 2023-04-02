app.run([
  "$rootScope",
  "$location",
  "superadminStatsService",
  function ($rootScope, $location, superadminStatsService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/super-admin/stats") {
        superadminStatsService
          .fetchNumericStats()
          .then(function (data) {
            var data = data.data.data;
            console.log(data);

            $rootScope.totalBrands = data.totalBrands[0]?.count || 0;
            $rootScope.brandsList = data.totalBrands[0]?.documents;
            $rootScope.totalProjects =
              data.totalProjects[0]?.total_projects || 0;
            $rootScope.totalTasks = data.totalTasks[0]?.total_tasks || 0;
            $rootScope.totalUsers = data.totalUsers[0]?.total_users || 0;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  },
]);

app.controller("superadminStatsController", [
  "$scope",
  "$rootScope",
  "$location",
  "loginService",
  "superadminStatsService",
  function (
    $scope,
    $rootScope,
    $location,
    loginService,
    superadminStatsService
  ) {
    $scope.handleLogout = function () {
      loginService.authLogout();
    };

    $scope.selectedBrand = null;

    $scope.handleBrandClick = function (brand) {
      $scope.selectedBrand = brand;
      superadminStatsService
        .fetchBrandWiseStats(brand._id)
        .then(function (data) {
          var data = data.data.data;

          $rootScope.totalBrandProjects = data.projectCounts[0]?.total || 0;
          $rootScope.completedBrandProjects =
            data.projectCounts[0]?.completed || 0;
          $rootScope.notCompletedBrandProjects =
            data.projectCounts[0]?.not_completed || 0;
          $rootScope.projectList = data.projectList;
          $rootScope.totalBrandUsers = data.totalUsersOfABrand[0].total_users;

          $rootScope.projectTaskCounts = data.taskCountInProjects;

          var k = 0;
          for (var i = 0; i < $rootScope.projectList.length; i++) {
            var found = false;
            for (var j = 0; j < $rootScope.projectTaskCounts.length; j++) {
              if (
                $rootScope.projectList[i].title ===
                $rootScope.projectTaskCounts[j]._id
              ) {
                $rootScope.projectList[i].items =
                  $rootScope.projectTaskCounts[j].totalTasks;
                found = true;
                break;
              }
            }

            if (!found) {
              $rootScope.projectList[i].count = 0;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
