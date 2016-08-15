'use strict';

angular.module('personal', ['ui.router']);
'use strict';

angular.module('personal').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: '../views/home.html',
    controller: 'mainController'
  });

  $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('personal').controller('mainController', function ($scope, mainService) {

  $scope.test = "Angular is working";
}); //End mainController
'use strict';

angular.module('personal').directive('mainDirective', function () {}); //End mainDirective
'use strict';

angular.module('personal').service('mainService', function ($http) {}); //End mainService