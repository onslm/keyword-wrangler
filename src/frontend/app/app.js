'use strict'

(function() {

  var app = angular.module('app', ['ngRoute', 'ngGrid', 'restangular'])

  app.config(['$routeProvider',
   $routeProvider.
    when('/', {
      templateUrl: 'app/keywords/partials/editor.html',
      controller: 'KeywordsController'
    })
  ])

})()
