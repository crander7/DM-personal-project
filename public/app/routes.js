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
    .state('admin', {
        url: '/admin',
        templateUrl: '../views/admin.html',
        controller: 'mainController',
        resolve: {
            requireAuthentication: function(userService, $state) {
                // console.log('made it to resolve');
                return userService.checkAuth().then(response => {
                    // console.log("resolve checkAuth response: ", response[0]);
                    if (response[0].type === 'admin') {
                        // console.log("made it to admin page");
                        // $state.go('admin');
                    }
                    else {
                        // console.log('redirected home');
                        $state.go('home');
                    }
                });
            }
        }
    })
    .state('user-data', {
        url: '/user-update',
        templateUrl: '../views/user-data.html',
        controller: 'mainController',
        resolve: {
            requireAuthentication: function(userService, $state) {
                // console.log('made it to resolve');
                return userService.checkAuth().then(response => {
                    // console.log("resolve checkAuth response: ", response[0]);
                    if (response[0].type === 'admin') {
                        // console.log("made it to admin page");
                        // $state.go('admin');
                    }
                    else {
                        // console.log('redirected home');
                        $state.go('home');
                    }
                });
            }
        }
    })
    .state('bracket-edit', {
        url: '/bracket-edit',
        templateUrl: '../views/bracket-edit.html',
        controller: 'mainController',
        resolve: {
            requireAuthentication: function(userService, $state) {
                // console.log('made it to resolve');
                return userService.checkAuth().then(response => {
                    // console.log("resolve checkAuth response: ", response[0]);
                    if (response[0].type === 'admin') {
                        // console.log("made it to admin page");
                        // $state.go('admin');
                    }
                    else {
                        // console.log('redirected home');
                        $state.go('home');
                    }
                });
            }
        }
    });


  $urlRouterProvider.otherwise('/');


});
