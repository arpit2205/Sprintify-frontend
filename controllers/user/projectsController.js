app.run([
  "$rootScope",
  "$location",
  "projectService",
  "userService",
  function ($rootScope, $location, projectService, userService) {
    $rootScope.$on("$locationChangeStart", function () {
      if ($location.path() === "/user/projects") {
        // reset tasks
        $rootScope.activeProjectTasks = null;
        $rootScope.task = null;
        $rootScope.selectedSprint = null;
        $rootScope.paginationCount = null;
        $rootScope.paginationArray = null;

        // fetch projects
        projectService
          .fetchProjects()
          .then(function (data) {
            $rootScope.projects = data.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        // userService
        //   .fetchUsers()
        //   .then(function (data) {
        //     $rootScope.users = data.data.data;
        //     localStorage.setItem("users", JSON.stringify(data.data.data));
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
      }
    });
  },
]);

app.controller("userProjectsController", [
  "$scope",
  "$rootScope",
  "$location",
  "loginService",
  "projectService",
  "userService",
  "utilService",
  function (
    $scope,
    $rootScope,
    $location,
    loginService,
    projectService,
    userService,
    utilService
  ) {
    $scope.addProjectForm = false;
    $scope.selectedMembers = [];

    $scope.handleLogout = function () {
      loginService.authLogout();
    };

    $scope.addMembersChange = function () {
      if (!$scope.addProject.membersSearch) return;

      userService
        .fetchUsersByRegex($scope.addProject.membersSearch)
        .then(function (data) {
          $scope.results = data.data.data;
          console.log(data.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.handleSelectMember = function (user) {
      var found = false;
      for (var i = 0; i < $scope.selectedMembers.length; i++) {
        if (user.email === $scope.selectedMembers[i].email) {
          found = true;
          break;
        }
      }

      if (!found) {
        $scope.selectedMembers.push(user);
      }
    };

    $scope.handleRemoveSelectedMember = function (user) {
      var index = $scope.selectedMembers.indexOf(user);
      if (index !== -1) {
        $scope.selectedMembers.splice(index, 1);
      }
    };

    // submit form
    $scope.handleCreateProject = function () {
      var members = [];
      for (let i = 0; i < $scope.selectedMembers.length; i++) {
        members.push({
          memberId: $scope.selectedMembers[i]._id.toString(),
          name: $scope.selectedMembers[i].name,
          email: $scope.selectedMembers[i].email,
          roles: $scope.selectedMembers[i].roles,
        });
      }

      var data = {
        title: $scope.addProject.title,
        description: $scope.addProject.description,
        status: $scope.addProject.status,
        members: members,
      };

      projectService
        .createProject(data)
        .then(function (data) {
          $rootScope.projects.push(data.data.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    };

    $scope.toggleAddProjectForm = function () {
      $scope.addProjectForm = !$scope.addProjectForm;
    };

    $scope.handleSelectProject = function (project) {
      $rootScope.activeProject = project;
      localStorage.setItem("project", JSON.stringify(project));
      $location.path("/user/backlog");
    };
  },
]);
