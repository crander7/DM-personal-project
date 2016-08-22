angular.module('personal').config(($stateProvider, $urlRouterProvider) => {

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '../views/home.html',
      controller: 'mainController'
    })
    .state('auto-compare', {
      url: '/tax-comparison-auto',
      templateUrl: '../views/auto-compare.html',
      controller: 'mainController'
    })
    .state('filing-status', {
      url: '/tax-comparison-business/filing-status',
      templateUrl: '../views/filing-status.html',
      controller: 'mainController'
    })
    .state('w2-income', {
      url: '/tax-comparison-business/w2-income',
      templateUrl: '../views/w2-income.html',
      controller: 'mainController'
    })
    .state('business-income', {
      url: '/tax-comparison-business/business-income',
      templateUrl: '../views/business-income.html',
      controller: 'mainController'
    })
    .state('deductions', {
      url: '/tax-comparison-business/deductions',
      templateUrl: '../views/deductions.html',
      controller: 'mainController'
    })
    .state('exemptions', {
      url: '/tax-comparison-business/exemptions',
      templateUrl: '../views/exemptions.html',
      controller: 'mainController'
    })
    .state('personal-expense', {
      url: '/tax-comparison-business/personal-expense',
      templateUrl: '../views/personal-expense.html',
      controller: 'mainController'
    })
    .state('business-expense', {
      url: '/tax-comparison-business/business-expense',
      templateUrl: '../views/business-expense.html',
      controller: 'mainController'
    })
    .state('business-results', {
      url: '/tax-comparison-business/business-results',
      templateUrl: '../views/business-results.html',
      controller: 'mainController'
    })
    .state('login', {
        url: '/login',
        templateUrl: '../views/login.html',
        controller: 'mainController'
    });


  $urlRouterProvider.otherwise('/');


});
