app.run([
  "$rootScope",
  "$location",
  "sprintService",
  "taskService",
  "toastService",
  function ($rootScope, $location, sprintService, taskService, toastService) {
    $rootScope.$on("$locationChangeSuccess", function () {
      if ($location.path() === "/user/sprints") {
        $rootScope.task = null;

        var project =
          $rootScope.activeProject ||
          JSON.parse(localStorage.getItem("project"));

        if (!project) {
          $location.path("/user/projects");
          return;
        }

        $rootScope.activeProject = project;

        $rootScope.calculatingPercentTask = false;

        // fetch tasks
        taskService
          .fetchTasks()
          .then(function (data) {
            $rootScope.activeProjectTasks = data.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        // fetch sprints
        sprintService
          .fetchSprints()
          .then(function (data) {
            var sprints = data.data.data;

            // calculate days left for sprint
            for (var i = 0; i < sprints.length; i++) {
              if (sprints[i].isStarted) {
                var date1 = new Date(sprints[i].startedAt.toString());
                var date2 = new Date(new Date().toISOString());

                var diffInMs = parseInt(date2 - date1);
                var diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

                var daysLeft =
                  parseInt(sprints[i].duration) - parseInt(diffInDays);

                if (daysLeft < 0) {
                  daysLeft *= -1;
                  sprints[i].daysLeft = `Overdue by ${daysLeft} days`;
                } else sprints[i].daysLeft = `${daysLeft} days left`;
              }
            }

            // fetch sprint status - % of tasks completed
            $rootScope.calculatingPercentTask = true;
            sprintService
              .fetchSprintStatus($rootScope.activeProject._id)
              .then(function (data) {
                var statusOfAllSprints = data.data.data;

                let statusObj = {};
                for (var i = 0; i < statusOfAllSprints.length; i++) {
                  if (statusOfAllSprints[i]._id) {
                    statusObj[statusOfAllSprints[i]._id] =
                      statusOfAllSprints[i].percentCompleted;
                  }
                }

                console.log(statusObj);

                for (var i = 0; i < sprints.length; i++) {
                  if (statusObj[sprints[i]._id] >= 0) {
                    sprints[i].percentCompleted = Math.round(
                      statusObj[sprints[i]._id]
                    );
                  }
                }

                console.log(sprints);
                $rootScope.calculatingPercentTask = false;
                $rootScope.sprints = sprints;
              })
              .catch(function (error) {
                console.log(error);
              });
          })
          .catch(function (error) {
            console.log(error);
            toastService.showToast("Error fetching sprints", "warning", 3000);
          });
      }
    });
  },
]);

app.controller("userSprintController", [
  "$scope",
  "$rootScope",
  "$location",
  "sprintService",
  "toastService",
  function ($scope, $rootScope, $location, sprintService, toastService) {
    $scope.handleCreateSprint = function () {
      var data = {
        name: $scope.createSprint.name,
        description: $scope.createSprint.description,
        project: {
          projectId: $rootScope.activeProject._id,
          title: $rootScope.activeProject.title,
        },
        duration: $scope.createSprint.duration,
      };

      toastService.showToast("Creating new sprint", "info", 3000);

      sprintService
        .createSprint(data)
        .then(function (data) {
          $rootScope.sprints.unshift(data.data.data);
          toastService.showToast(
            "New sprint created successfully",
            "success",
            3000
          );
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast("Error creating new sprint", "warning", 3000);
        });
    };

    $scope.handleSprintSelect = function (sprint) {
      $rootScope.selectedSprint = sprint.name;
      $location.path("/user/backlog");
    };

    $scope.handleStartSprint = function (sprint) {
      toastService.showToast(`Starting ${sprint.name} sprint`, "info", 3000);
      sprintService
        .startSprint(sprint._id)
        .then(function (data) {
          var updatedSprint = data.data.data;

          toastService.showToast(
            `${sprint.name} sprint successfully started`,
            "success",
            3000
          );

          // calculate days left
          var date1 = new Date(updatedSprint.startedAt.toString());
          var date2 = new Date(new Date().toISOString());

          var diffInMs = parseInt(date2 - date1);
          var diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

          var daysLeft =
            parseInt(updatedSprint.duration) - parseInt(diffInDays);

          if (daysLeft < 0) {
            daysLeft *= -1;
            updatedSprint.daysLeft = `Overdue by ${daysLeft} days`;
          } else updatedSprint.daysLeft = `${daysLeft} days left`;
          //

          var index = $rootScope.sprints.indexOf(sprint);

          $rootScope.sprints[index] = updatedSprint;
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast(`Error starting sprint`, "warning", 3000);
        });
    };

    $scope.handleCompleteSprint = function (sprint) {
      toastService.showToast(
        `Marking ${sprint.name} sprint as completed`,
        "info",
        3000
      );
      sprintService
        .finishSprint(sprint._id)
        .then(function (data) {
          console.log(data.data.data);
          toastService.showToast(
            `${sprint.name} sprint marked completed`,
            "success",
            3000
          );
          var updatedSprint = data.data.data;
          var index = $rootScope.sprints.indexOf(sprint);
          $rootScope.sprints[index] = updatedSprint;
        })
        .catch(function (error) {
          console.log(error);
          toastService.showToast(`Error completing sprint`, "warning", 3000);
        });
    };
  },
]);
