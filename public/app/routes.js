angular.module('personal').config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../views/home.html',
      controller: 'mainController'
    })
    .state('business-compare', {
      url: '/tax-comparison-business',
      templateUrl: '../views/business-compare.html',
      controller: 'mainController'
    })
    .state('auto-compare', {
      url: '/tax-comparison-auto',
      templateUrl: '../views/auto-compare.html',
      controller: 'mainController'
    });


  $urlRouterProvider.otherwise('/');


});
