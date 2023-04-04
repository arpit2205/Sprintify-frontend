angular.module("app").factory("toastService", function ($rootScope, $timeout) {
  var toastService = {};

  toastService.showToast = function (message, type, timeout) {
    // remove existing toasts
    var existingToasts = document.getElementsByClassName("toast");
    for (let i = 0; i < existingToasts.length; i++) {
      existingToasts[i].remove();
    }

    // add new toast
    var toast = document.createElement("div");

    toast.classList.add("toast-message");
    toast.classList.add("toast");
    toast.innerHTML = message;

    if (type === "success") {
      toast.style.background = "#36b37e";
    } else if (type === "info") {
      toast.style.background = "#0052cc";
    } else if (type === "warning") {
      toast.style.background = "#ff5630";
    } else {
      toast.style.background = "#172b4d";
    }

    document.body.appendChild(toast);

    $timeout(function () {
      toast.classList.add("fade-out");
      $timeout(function () {
        document.body.removeChild(toast);
      }, 5000);
    }, timeout);
  };

  return toastService;
});
