app.run([
  "$rootScope",
  "$location",
  "taskService",
  function ($rootScope, $location, taskService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/backlog") {
        var project =
          $rootScope.activeProject ||
          JSON.parse(localStorage.getItem("project"));

        if (!project) {
          $location.path("/user/projects");
          return;
        }

        $rootScope.activeProject = project;

        taskService
          .fetchTasks()
          .then(function (data) {
            $rootScope.activeProjectTasks = data.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  },
]);

app.controller("userBacklogController", [
  "$scope",
  "$rootScope",
  "$location",
  "taskService",
  function ($scope, $rootScope, $location, taskService) {
    $scope.handleCreateTask = function () {
      var data = {
        taskId: `BL-${taskService.uniqueId()}`,
        title: $scope.createTask.title,
        project: {
          projectId: $rootScope.activeProject._id,
          title: $rootScope.activeProject.title,
        },
        status: $scope.createTask.status,
        type: $scope.createTask.type,
        priority: $scope.createTask.priority,
      };

      taskService
        .createTask(data)
        .then(function (data) {
          console.log(data.data.data);
          $rootScope.activeProjectTasks.push(data.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
