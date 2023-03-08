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

        // fetch projects
        projectService
          .fetchProjects()
          .then(function (data) {
            $rootScope.projects = data.data.data;
          })
          .catch(function (error) {
            console.log(error);
          });

        userService
          .fetchUsers()
          .then(function (data) {
            $rootScope.users = data.data.data;
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
  "projectService",
  function ($scope, $rootScope, $location, loginService, projectService) {
    $scope.addProjectForm = false;
    $scope.localUsers = $rootScope.users;
    $scope.selectedMembers = [];

    $scope.handleLogout = function () {
      loginService.authLogout();
    };

    $scope.addMembersChange = function () {
      $scope.localUsers = $rootScope.users;
      var users = $scope.localUsers;
      var results = [];

      for (var i = 0; i < users.length; i++) {
        if (
          users[i].name.toLowerCase().match($scope.addProject.membersSearch)
        ) {
          results.push(users[i]);
        }
      }

      $scope.results = results;
    };

    $scope.handleSelectMember = function (user) {
      var index = $scope.selectedMembers.indexOf(user);
      if (index === -1) {
        $scope.selectedMembers.push(user);
      } else {
        $scope.selectedMembers.splice(index, 1);
      }

      console.log($scope.selectedMembers);
    };

    $scope.handleRemoveSelectedMember = function (user) {
      var index = $scope.selectedMembers.indexOf(user);
      if (index !== -1) {
        $scope.selectedMembers.splice(index, 1);
      }

      console.log($scope.selectedMembers);
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
      console.log("add");
    };

    $scope.handleSelectProject = function (project) {
      $rootScope.activeProject = project;
      localStorage.setItem("project", JSON.stringify(project));
      $location.path("/user/backlog");
    };
  },
]);
