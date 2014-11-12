var app = angular.module("MyApp", []);

app.controller("MyCtrl", function($scope) {
  $scope.filterFunction = function(element) {
    return element.name.match(/^Ma/) ? true : false;
  };

});
