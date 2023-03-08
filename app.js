var app = angular.module("app", [
  // "ngRoute",
  "ui.router",
  "angular-jwt",
]);

// run on first render and route change
app.run([
  "$rootScope",
  "$location",
  "jwtHelper",
  function ($rootScope, $location, jwtHelper) {
    $rootScope.$on("$locationChangeStart", function () {
      var jwt = localStorage.getItem("jwt-token");

      if (!jwt) {
        $location.path("/login");
        return;
      }

      var decodedToken = jwtHelper.decodeToken(jwt);

      $rootScope.authUser = decodedToken;

      if (decodedToken.isSuperAdmin && !$location.path().match("super-admin")) {
        $location.path("/super-admin/admins");
        return;
      }

      if (decodedToken.isBrandAdmin && !$location.path().match("brand-admin")) {
        $location.path("/brand-admin/users");
        return;
      }

      if (decodedToken.isBrandUser && !$location.path().match("user")) {
        $location.path("/user/projects");
        return;
      }
    });
  },
]);

// ng-router
// app.config([
//   "$routeProvider",
//   function ($routeProvider) {
//     $routeProvider
//       .when("/login", {
//         templateUrl: "views/public/login.html",
//         controller: "loginController",
//       })
//       .when("/super-admin/home", {
//         templateUrl: "views/superadmin/home.html",
//         controller: "superadminHomeController",
//       })
//       .when("/super-admin/reset-password", {
//         templateUrl: "views/superadmin/reset-password.html",
//         controller: "resetPasswordController",
//       })
//       .when("/brand-admin/home", {
//         templateUrl: "views/admin/home.html",
//         controller: "adminHomeController",
//       })
//       .when("/user/home", {
//         templateUrl: "views/user/home.html",
//         controller: "userHomeController",
//       })
//       .otherwise("/login");
//   },
// ]);

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function ($stateProvider, $urlRouterProvider) {
    // login
    $stateProvider.state("login", {
      url: "/login",
      templateUrl: "views/public/login.html",
      controller: "loginController",
    });

    // superadmin routes
    $stateProvider.state("superadmin", {
      url: "/super-admin",
      templateUrl: "views/superadmin/dashboard.html",
      controller: "superadminHomeController",
    });

    $stateProvider.state("superadmin.admins", {
      url: "/admins",
      templateUrl: "views/superadmin/admins.html",
      controller: "superadminHomeController",
    });

    $stateProvider.state("superadminResetPassword", {
      url: "/super-admin/reset-password",
      templateUrl: "views/superadmin/reset-password.html",
      controller: "resetPasswordController",
    });

    // brand admin routes
    $stateProvider.state("admin", {
      url: "/brand-admin",
      templateUrl: "views/admin/dashboard.html",
      controller: "adminHomeController",
    });

    $stateProvider.state("admin.users", {
      url: "/users",
      templateUrl: "views/admin/users.html",
      controller: "adminHomeController",
    });

    // users
    $stateProvider.state("projects", {
      url: "/user/projects",
      templateUrl: "views/user/projects.html",
      controller: "userProjectsController",
    });

    $stateProvider.state("user", {
      url: "/user",
      templateUrl: "views/user/dashboardLayout.html",
      controller: "userHomeController",
    });

    $stateProvider.state("user.dashboard", {
      url: "/dashboard",
      templateUrl: "views/user/dashboardContent.html",
    });

    $stateProvider.state("user.backlog", {
      url: "/backlog",
      templateUrl: "views/user/backlog.html",
      controller: "userBacklogController",
    });

    $stateProvider.state("user.sprints", {
      url: "/sprints",
      templateUrl: "views/user/sprints.html",
    });

    $stateProvider.state("user.board", {
      url: "/board",
      templateUrl: "views/user/board.html",
    });

    $urlRouterProvider.otherwise("/login");
  },
]);

app.controller("appController", [
  "$rootScope",
  "$scope",
  function ($rootScope, $scope) {},
]);
