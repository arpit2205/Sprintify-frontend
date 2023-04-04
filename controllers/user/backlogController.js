app.run([
  "$rootScope",
  "$location",
  "taskService",
  "sprintService",
  "toastService",
  function ($rootScope, $location, taskService, sprintService, toastService) {
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
            toastService.showToast("Error fetching backlog", "warning", 3000);
          });

        // fetch project sprints

        sprintService
          .fetchSprints("active")
          .then(function (data) {
            $rootScope.sprints = data.data.data;
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast("Error fetching sprints", "warning", 3000);
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
  "toastService",
  function (
    $scope,
    $rootScope,
    $location,
    taskService,
    sprintService,
    utilService,
    toastService
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

      toastService.showToast(
        `Creating new ${$scope.createTask.type}`,
        "info",
        3000
      );

      taskService
        .createTask(data)
        .then(function (data) {
          toastService.showToast(
            `New ${$scope.createTask.type} created`,
            "success",
            3000
          );
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
          toastService.showToast(
            `Error creating new ${$scope.createTask.type}`,
            "warning",
            3000
          );
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

      toastService.showToast(`Reseting filters, please wait`, "info", 3000);

      taskService
        .fetchTasks(1, 10, $scope.filterTask)
        .then(function (data) {
          console.log(data.data.data);
          toastService.showToast(`Filtered results fetched`, "success", 3000);
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
      if (
        !$scope.filterTask.type &&
        !$scope.filterTask.priority &&
        !$scope.filterTask.status &&
        !$scope.filterTask.sprint &&
        !$scope.filterTask.text
      ) {
        toastService.showToast(`Select at least one filter`, "info", 3000);
        return;
      }

      toastService.showToast(`Applying filters, please wait`, "info", 3000);
      console.log($scope.filterTask);
      taskService
        .fetchTasks(1, 10, $scope.filterTask)
        .then(function (data) {
          console.log(data.data.data);
          toastService.showToast(`Filtered results fetched`, "success", 3000);
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
      if (!$scope.moveToSprint.sprint) {
        toastService.showToast(`Select a sprint first`, "info", 3000);
        return;
      }

      if ($scope.selectedTasksForSprint.length === 0) {
        toastService.showToast(
          `Select at least 1 backlog item to be added`,
          "info",
          3000
        );
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

      toastService.showToast(
        `Adding ${$scope.selectedTasksForSprint.length} items to ${selectedSprint.name} sprint`,
        "info",
        3000
      );

      sprintService
        .addTasksToSprint(sprint, taskIdsToBeUpdated)
        .then(function (data) {
          console.log(data.data.data);

          toastService.showToast(
            `Added ${$scope.selectedTasksForSprint.length} items to ${selectedSprint.name} sprint`,
            "success",
            3000
          );

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
          toastService.showToast(
            `Error adding tasks to sprint`,
            "warning",
            3000
          );
        });
    };

    $scope.handleRemoveFromSprint = function () {
      if ($scope.selectedTasksForSprint.length === 0) {
        toastService.showToast(
          `Select at least 1 backlog item to be removed from sprint`,
          "info",
          3000
        );
        return;
      }

      var taskIdsToBeUpdated = [];
      for (var i = 0; i < $scope.selectedTasksForSprint.length; i++) {
        taskIdsToBeUpdated.push($scope.selectedTasksForSprint[i]._id);
      }

      toastService.showToast(
        `Removing ${taskIdsToBeUpdated.length} items from their sprint`,
        "info",
        3000
      );

      sprintService
        .addTasksToSprint(null, taskIdsToBeUpdated)
        .then(function (data) {
          console.log(data.data.data);

          toastService.showToast(
            `Removed ${taskIdsToBeUpdated.length} items from their sprint`,
            "success",
            3000
          );

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
          toastService.showToast(
            `Error removing items from sprint`,
            "warning",
            3000
          );
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
