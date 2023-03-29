app.run([
  "$rootScope",
  "$location",
  "taskService",
  "sprintService",
  function ($rootScope, $location, taskService, sprintService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/backlog") {
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

        // fetch project tasks
        taskService
          .fetchTasks(1, 10)
          .then(function (data) {
            $rootScope.activeProjectTasks = data.data.data;
            console.log(data.data.data);
            var totalDocuments = data.data.totalDocuments;
            $rootScope.paginationCount = Math.ceil(totalDocuments / 10);
            $rootScope.paginationArray = [];
            for (var i = 1; i <= $rootScope.paginationCount; i++) {
              $rootScope.paginationArray.push(i);
            }

            $rootScope.selectedPage = 1;
          })
          .catch(function (error) {
            console.log(error);
          });

        // fetch project sprints

        sprintService
          .fetchSprints("active")
          .then(function (data) {
            $rootScope.sprints = data.data.data;
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
  "sprintService",
  "utilService",
  function (
    $scope,
    $rootScope,
    $location,
    taskService,
    sprintService,
    utilService
  ) {
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
          taskService
            .fetchTasks(1, 10, $scope.filterTask)
            .then(function (data) {
              console.log(data.data.data);
              $rootScope.activeProjectTasks = data.data.data;
              var totalDocuments = data.data.totalDocuments;
              $rootScope.paginationCount = Math.ceil(totalDocuments / 10);
              $rootScope.paginationArray = [];
              for (var i = 1; i <= $rootScope.paginationCount; i++) {
                $rootScope.paginationArray.push(i);
              }
              $rootScope.selectedPage = 1;
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleTaskRedirect = function (task) {
      if (window.event.srcElement.localName === "input") {
        return;
      }

      $location.path(`/user/backlog/${task._id}`);
      $rootScope.task = task;
    };

    // Filters start ///////////////////////////////

    $scope.filterTask = {
      type: "",
      priority: "",
      status: "",
      text: "",
    };

    $scope.filterTask.sprint = $rootScope.selectedSprint || "";

    $scope.handleResetFilters = function () {
      $scope.filterTask = {
        type: "",
        priority: "",
        status: "",
        sprint: "",
        text: "",
      };

      $rootScope.selectedSprint = "";

      taskService
        .fetchTasks(1, 10, $scope.filterTask)
        .then(function (data) {
          console.log(data.data.data);
          $rootScope.activeProjectTasks = data.data.data;
          var totalDocuments = data.data.totalDocuments;
          $rootScope.paginationCount = Math.ceil(totalDocuments / 10);
          $rootScope.paginationArray = [];
          for (var i = 1; i <= $rootScope.paginationCount; i++) {
            $rootScope.paginationArray.push(i);
          }
          $rootScope.selectedPage = 1;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleApplyFilters = function () {
      console.log($scope.filterTask);
      taskService
        .fetchTasks(1, 10, $scope.filterTask)
        .then(function (data) {
          console.log(data.data.data);
          $rootScope.activeProjectTasks = data.data.data;
          var totalDocuments = data.data.totalDocuments;
          $rootScope.paginationCount = Math.ceil(totalDocuments / 10);
          $rootScope.paginationArray = [];
          for (var i = 1; i <= $rootScope.paginationCount; i++) {
            $rootScope.paginationArray.push(i);
          }
          $rootScope.selectedPage = 1;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleTextSearchTask = function () {
      taskService
        .fetchTasks(1, 10, $scope.filterTask)
        .then(function (data) {
          console.log("called");
          $rootScope.activeProjectTasks = data.data.data;
          var totalDocuments = data.data.totalDocuments;
          $rootScope.paginationCount = Math.ceil(totalDocuments / 10);
          $rootScope.paginationArray = [];
          for (var i = 1; i <= $rootScope.paginationCount; i++) {
            $rootScope.paginationArray.push(i);
          }
          $rootScope.selectedPage = 1;
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    // filters over ////////////////////////////

    // add to sprints
    $scope.selectedTasksForSprint = [];

    $scope.handleCheckBoxChange = function (task) {
      if (task.isChecked) {
        $scope.selectedTasksForSprint.push(task);
      } else {
        if ($scope.selectedTasksForSprint.indexOf(task) !== -1) {
          var index = $scope.selectedTasksForSprint.indexOf(task);
          $scope.selectedTasksForSprint.splice(index, 1);
        }
      }

      console.log($scope.selectedTasksForSprint);
    };

    $scope.moveToSprint = {
      sprint: "",
    };

    $scope.handleMoveToSprint = function () {
      if (
        !$scope.moveToSprint.sprint ||
        $scope.selectedTasksForSprint.length === 0
      ) {
        return;
      }

      var taskIdsToBeUpdated = [];
      for (var i = 0; i < $scope.selectedTasksForSprint.length; i++) {
        taskIdsToBeUpdated.push($scope.selectedTasksForSprint[i]._id);
      }

      var selectedSprint = JSON.parse($scope.moveToSprint.sprint);
      var sprint = {
        sprintId: selectedSprint._id.toString(),
        name: selectedSprint.name,
      };

      sprintService
        .addTasksToSprint(sprint, taskIdsToBeUpdated)
        .then(function (data) {
          console.log(data.data.data);

          for (var i = 0; i < $rootScope.activeProjectTasks.length; i++) {
            if (
              taskIdsToBeUpdated.indexOf(
                $rootScope.activeProjectTasks[i]._id
              ) !== -1
            ) {
              $rootScope.activeProjectTasks[i].sprint = sprint;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleRemoveFromSprint = function () {
      if ($scope.selectedTasksForSprint.length === 0) {
        return;
      }

      var taskIdsToBeUpdated = [];
      for (var i = 0; i < $scope.selectedTasksForSprint.length; i++) {
        taskIdsToBeUpdated.push($scope.selectedTasksForSprint[i]._id);
      }

      sprintService
        .addTasksToSprint(null, taskIdsToBeUpdated)
        .then(function (data) {
          console.log(data.data.data);

          for (var i = 0; i < $rootScope.activeProjectTasks.length; i++) {
            if (
              taskIdsToBeUpdated.indexOf(
                $rootScope.activeProjectTasks[i]._id
              ) !== -1
            ) {
              $rootScope.activeProjectTasks[i].sprint = null;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    // pagination
    $scope.handlePageChange = function (page) {
      taskService
        .fetchTasks(page, 10, $scope.filterTask)
        .then(function (data) {
          $rootScope.activeProjectTasks = data.data.data;
          var totalDocuments = data.data.totalDocuments;
          $rootScope.paginationCount = Math.ceil(totalDocuments / 10);
          $rootScope.paginationArray = [];
          for (var i = 1; i <= $rootScope.paginationCount; i++) {
            $rootScope.paginationArray.push(i);
          }
          $rootScope.selectedPage = page;
        })
        .catch(function (error) {
          console.log(error);
        });
    };
  },
]);
