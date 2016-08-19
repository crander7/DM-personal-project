'use strict';

angular.module('personal', ['ui.router']);
'use strict';

angular.module('personal').config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: '../views/home.html',
    controller: 'mainController'
  }).state('auto-compare', {
    url: '/tax-comparison-auto',
    templateUrl: '../views/auto-compare.html',
    controller: 'mainController'
  }).state('filing-status', {
    url: '/tax-comparison-business/filing-status',
    templateUrl: '../views/filing-status.html',
    controller: 'mainController'
  }).state('w2-income', {
    url: '/tax-comparison-business/w2-income',
    templateUrl: '../views/w2-income.html',
    controller: 'mainController'
  }).state('business-income', {
    url: '/tax-comparison-business/business-income',
    templateUrl: '../views/business-income.html',
    controller: 'mainController'
  }).state('deductions', {
    url: '/tax-comparison-business/deductions',
    templateUrl: '../views/deductions.html',
    controller: 'mainController'
  }).state('exemptions', {
    url: '/tax-comparison-business/exemptions',
    templateUrl: '../views/exemptions.html',
    controller: 'mainController'
  }).state('personal-expense', {
    url: '/tax-comparison-business/personal-expense',
    templateUrl: '../views/personal-expense.html',
    controller: 'mainController'
  }).state('business-expense', {
    url: '/tax-comparison-business/business-expense',
    templateUrl: '../views/business-expense.html',
    controller: 'mainController'
  }).state('business-results', {
    url: '/tax-comparison-business/business-results',
    templateUrl: '../views/business-results.html',
    controller: 'mainController'
  });

  $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('personal').controller('mainController', function ($rootScope, $scope, $state, mainService) {

    $rootScope.$state = $state;

    $scope.alert = function (calc) {
        alertify.alert("Heads Up", "We just need to ask you a few questions!", function () {
            alertify.success('Ok, Lets Start!');
            $state.go(calc);
        }).set({
            transition: 'slide',
            movable: false
        }).show();
    };

    // if($state.current.name !== 'home') {
    //         $rootScope.showToggle = false;
    //         $rootScope.currentLoc = $state.current.name;
    //         console.log($state.current.name);
    //         console.log($scope.showToggle);
    // }
    // else {
    //     $rootScope.showToggle = true;
    //     $rootScope.currentLoc = $state.current.name;
    //     console.log($state.current.name);
    //     console.log($scope.showToggle);
    // }
}); //End mainController
'use strict';

angular.module('personal').directive('barChart', function () {

  return {
    restrict: 'E',
    link: function link(scope, element, attrs) {

      var margin = {
        top: 20,
        right: 10,
        bottom: 100,
        left: 50
      },
          width = 700 - margin.right - margin.left,
          _height = 500 - margin.top - margin.bottom;

      var svg = d3.select("body").append("svg").attr({
        "width": width + margin.right + margin.left,
        "height": _height + margin.top + margin.bottom
      }).append("g").attr("transform", "translate(" + margin.left + "," + margin.right + ")");

      // define x and y scales
      var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2, 0.2);

      var yScale = d3.scale.linear().range([_height, 0]);

      // define x axis and y axis
      var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

      var yAxis = d3.svg.axis().scale(yScale).orient("left");

      var data = myData;

      // sort the gdp values
      // data.sort(function(a, b) {
      //     return b.gdp - a.gdp;
      // });

      xScale.domain(data.map(function (d) {
        return d.name;
      }));
      yScale.domain([0, d3.max(data, function (d) {
        return d.age;
      })]);

      svg.selectAll('rect').data(data).enter().append('rect').attr("height", 0).attr("y", _height).transition().duration(3000).delay(function (d, i) {
        return i * 200;
      })
      // attributes can be also combined under one .attr
      .attr({
        "x": function x(d) {
          return xScale(d.name);
        },
        "y": function y(d) {
          return yScale(d.age);
        },
        "width": xScale.rangeBand(),
        "height": function height(d) {
          return _height - yScale(d.age);
        }
      }).style("fill", function (d, i) {
        return 'rgb(20, 20, ' + (i * 30 + 100) + ')';
      });

      svg.selectAll('text').data(data).enter().append('text').text(function (d) {
        return d.age;
      }).attr({
        "x": function x(d) {
          return xScale(d.name) + xScale.rangeBand() / 2;
        },
        "y": function y(d) {
          return yScale(d.age) + 12;
        },
        "font-family": 'sans-serif',
        "font-size": '13px',
        "font-weight": 'bold',
        "fill": 'white',
        "text-anchor": 'middle'
      });

      // Draw xAxis and position the label
      svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + _height + ")").call(xAxis).selectAll("text").attr("dx", "-.8em").attr("dy", ".25em").attr("transform", "rotate(-60)").style("text-anchor", "end").attr("font-size", "10px");

      // Draw yAxis and postion the label
      svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("x", -_height / 2).attr("dy", "-3em").style("text-anchor", "middle").text("Age in Years");
    }

  };
}); //End bar Chart Directive
'use strict';

angular.module('personal').directive('captureDirective', function () {
    return {
        templateUrl: '../../views/input-templ.html',
        restrict: 'E'
    };
});
'use strict';

angular.module('personal').directive('mainDirective', function () {}); //End mainDirective
'use strict';

angular.module('personal').directive('typedDirective', function () {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      alertify.defaults.transition = "zoom";
      alertify.defaults.theme.ok = "ui positive button";
      alertify.defaults.theme.cancel = "ui black button";
      $(function () {
        $(element).typed({
          strings: ["find <strong>Tax Advantages</strong>^300", "structure your business.^300", "<strong>Save Money</strong>.^5000"],
          typeSpeed: 0,
          loop: true
        });
      });
    }
  };
}); //End directive
'use strict';

angular.module('personal').service('mainService', function ($http) {}); //End mainService