angular.module('personal').config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../views/home.html',
      controller: 'mainController'
    });


  $urlRouterProvider.otherwise('/');


});
