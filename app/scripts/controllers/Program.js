﻿'use strict';

angular.module('tilosApp').config(function ($stateProvider) {
  $stateProvider.state('archiveDefault', {
    url: '/archive',
    templateUrl: 'partials/program.html',
    controller: 'ProgramCtrl'
  });
  $stateProvider.state('archive', {
    url: '/archive/:year/:month/:day',
    templateUrl: 'partials/program.html',
    controller: 'ProgramCtrl'
  });
});
angular.module('tilosApp').controller('ProgramCtrl', function ($scope, $state, $stateParams, API_SERVER_ENDPOINT, $http, datepickerPopupConfig, $timeout) {
    datepickerPopupConfig.showButtonBar = false;

    $scope.gotoDay = function(date) {
      var monthStr = ('0' + (date.getMonth() + 1)).slice(-2);
      var dayStr = ('0' + date.getDate()).slice(-2);
      $state.go('archive', {'year': date.getFullYear(), 'month': monthStr, 'day': dayStr});
    };

    $scope.prev = function () {
      var prev = new Date($scope.selectedDate.getTime() - 60 * 60 * 24 * 1000);
      $scope.gotoDay(prev);

    };

    $scope.next = function () {
      var next = new Date($scope.selectedDate.getTime() + 60 * 60 * 24 * 1000);
      $scope.gotoDay(next);
    };

    $scope.retrieveEpisodesForDay = function (timestamp) {
      var from = new Date(timestamp);
      from.setToDayStart();
      var to = new Date(timestamp);
      to.setToDayEnd();
      $http.get(API_SERVER_ENDPOINT + '/api/v1/episode?start=' + from.getTime() + '&end=' + to.getTime(), {cache: true}).success(function (data) {
        $scope.episodes = data;
      });
    };


    $scope.program = {};
    var now = new Date();
    now.setToNoon();
    $scope.selectedDate = new Date();


    $scope.selectedDate = now;
    if ($stateParams.year) {
      $scope.selectedDate = new Date($stateParams.year, $stateParams.month - 1, $stateParams.day, 12, 0, 0);
    }

    //Get today's episodes.
    $scope.retrieveEpisodesForDay($scope.selectedDate.getTime());

    $scope.today = function () {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
      $scope.showWeeks = !$scope.showWeeks;
    };

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.toggleMin = function () {
      $scope.minDate = ($scope.minDate) ? null : new Date();
    };

    $scope.open = function () {
      $timeout(function () {
        $scope.opened = true;
      });
    };
    $scope.goto = function () {
      $scope.gotoDay($scope.selectedDate);
    };
    $scope.dateOptions = {
      'year-format': '\'yy\'',
      'starting-day': 1
    };
  }
);
