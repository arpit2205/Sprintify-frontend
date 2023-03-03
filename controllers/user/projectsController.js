app.run([
  "$rootScope",
  "$location",
  "projectService",
  function ($rootScope, $location, projectService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/projects") {
        projectService
          .fetchProjects()
          .then(function (data) {
            console.log(data.data.data);
            $rootScope.projects = data.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  },
]);

app.controller("userProjectsController", [
  "$scope",
  "$rootScope",
  "$location",
  "loginService",
  function ($scope, $rootScope, $location, loginService) {
    $scope.handleLogout = function () {
      loginService.authLogout();
    };

    $scope.handleSelectProject = function (project) {
      $rootScope.activeProject = project;
      $location.path("/user/dashboard");
    };
  },
]);
