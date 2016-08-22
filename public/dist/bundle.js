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
  }).state('login', {
    url: '/login',
    templateUrl: '../views/login.html',
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

    var destPicker = function destPicker() {
        var state = $state.current.name;
        switch (state) {
            case 'filing-status':
                $state.go('w2-income');
                break;
            case 'w2-income':
                $state.go('business-income');
                break;
            case 'business-income':
                $state.go('deductions');
                break;
            case 'deductions':
                $state.go('exemptions');
                break;
            case 'exemptions':
                $state.go('personal-expense');
                break;
            case 'personal-expense':
                $state.go('business-expense');
                break;
            case 'business-expense':
                $state.go('business-results');
                break;
            default:
                $state.go('home');
        }
    };

    $scope.proceed = function (num) {
        if (isNaN(num) || num === '') {
            $scope.num = '';
            alertify.alert("Invalid Entry", "Please enter a number even if its a 0.", function () {
                alertify.message('click i for more info.');
            }).set({
                transition: 'slide',
                movable: false
            }).show();
        } else {
            alertify.success('Awesome!');
            mainService.addToClient(num, $state.current.name);
            if ($state.current.name === 'business-expense') {
                mainService.getTaxData().then(function (response) {});
            }
            destPicker();
        }
    };

    (function () {
        var rawName = $state.current.name;
        var nameArr = [];
        var result = '';
        if (rawName.includes('-')) {
            rawName = rawName.split('-');
            nameArr.push(rawName[0].charAt(0).toUpperCase() + rawName[0].slice(1));
            nameArr.push(rawName[1].charAt(0).toUpperCase() + rawName[1].slice(1));
            result = nameArr.join(" ");
        } else {
            rawName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            result = rawName;
        }
        $scope.pageName = result;
    })();

    $scope.filer = null;
    $scope.radioCheck = function (val) {
        if (val === null) {
            alertify.alert("Error", "Please select a filing status.", function () {
                alertify.message("Click i for more information");
            }).set({
                transition: 'slide',
                movable: false
            }).show();
        } else {
            mainService.addToClient(val, $state.current.name);
            destPicker();
        }
    };

    // $scope.showHelp = false;

    $scope.showHelp = function () {
        var page = $state.current.name;
        var info = '';
        switch (page) {
            case 'filing-status':
                info = "Your filing status is the option you use to file your taxes with the IRS";
                break;
            case 'w2-income':
                info = "This represents the your gross income if you are or where to be a regular salary or hourly employee";
                break;
            case 'business-income':
                info = "This is the gross income of your business(your total sales)";
                break;
            case 'deductions':
                info = "This is your tax deductions, if you use the standard deduction feel free to leave this blank";
                break;
            case 'exemptions':
                info = "This is the number of tax exemptions you claim. Typically this number will include you and any dependents you may have";
                break;
            case 'personal-expense':
                info = "This represents the total personal expense you have incurred due to your business";
                break;
            case 'business-expense':
                info = "These are any business expenses that the business has taken no including personal expense";
                break;
            default:
                info = "Unable to find help for this topic";
        }
        alertify.alert($scope.pageName + ' help', info).set({
            transition: 'zoom',
            movable: false
        }).show();
    };

    // $scope.addToClient = val => {
    //     alert(val);
    // };
    // let getName = () => {
    //     let rawName = $state.current.name;
    //     let nameArr = [];
    //     let result = '';
    //     if (rawName.includes('-')) {
    //         rawName = rawName.split('-');
    //         nameArr.push(rawName[0].charAt(0).toUpperCase() + rawName[0].slice(1));
    //         nameArr.push(rawName[1].charAt(0).toUpperCase() + rawName[1].slice(1));
    //         result = nameArr.join(" ");
    //     }
    //     else {
    //         rawName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    //         result = rawName;
    //     }
    //     $scope.pageName = result;
    // };
    // getName();

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
// angular.module('personal').directive('helpIcon', () => {
//     return {
//         // templateUrl: '../../views/help-icon.html',
//         restrict: 'A',
//         link: (scope, element, attrs) => {
//             let name = scope.pageName;
//             let info = '';
//             switch (name) {
//                 case 'Filing Status':
//                     info = "Your filing status is the option you use to file your taxes with the IRS";
//                     break;
//                 case 'W2 Income':
//                     info = "This represents the your gross income if you are or where to be a regular salary or hourly employee";
//                     break;
//                 case 'Business Income':
//                     info = "This is the gross income of your business(your total sales)";
//                     break;
//                 case 'Deductions':
//                     info = "This is your tax deductions, if you use the standard deduction feel free to leave this blank";
//                     break;
//                 case 'Exemptions':
//                     info = "This is the number of tax exemptions you claim. Typically this number will include you and any dependents you may have";
//                     break;
//                 case 'Personal Expense':
//                     info = "This represents the total personal expense you have incurred due to your business";
//                     break;
//                 case 'Business Expense':
//                     info = "These are any business expenses that the business has taken no including personal expense";
//                     break
//                 default:
//                     info = "Unable to find help for this topic";
//             }
//             let content = angular.element(
//                 `<div class="info-box" ng-class="{show: showHelp}">
//                 <h4>${info}</h4>
//                 </div>`
//             );
//             element.append(content);
//         }
//     };
// });
"use strict";
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

angular.module('personal').service('mainService', function ($http) {

    var client = {
        filingStatus: '',
        w2Income: '',
        businessIncome: '',
        deductions: '',
        exemptions: '',
        personalExpense: '',
        businessExpense: ''
    };

    this.addToClient = function (val, loc) {
        switch (loc) {
            case 'filing-status':
                client.filingStatus = val;
                break;
            case 'w2-income':
                client.w2Income = val;
                break;
            case 'business-income':
                client.businessIncome = val;
                break;
            case 'deductions':
                client.deductions = val;
                break;
            case 'exemptions':
                client.exemptions = val;
                break;
            case 'personal-expense':
                client.personalExpense = val;
                break;
            case 'business-expense':
                client.businessExpense = val;
                break;
            default:
                alertify.alert('Error', 'Value not added to client');
        }
    };

    this.getTaxData = function () {
        var taxCode = {};
        return $http({
            method: 'GET',
            url: '/tax-data?status=' + client.filingStatus
        }).then(function (response) {
            for (var i = 0; i < response.length; i++) {
                taxCode.response[i].name = response[i].value;
            }
            var startCalc = calcBracket(taxCode);
            return report;
        });
    };

    var calcBracket = function calcBracket(taxCode) {
        var result = {
            status: client.filingStatus,
            w2Wages: client.w2Income,
            // sCorpWages: ,
            businessNet: client.businessIncome,
            exemptions: client.exemptions * taxCode.personalExemption,
            personalExpense: client.personalExpense,
            businessExpense: client.businessExpense
        };
        if (client.deductions >= taxCode.standardDeduction) {
            result.deductions = client.deductions;
        } else {
            result.deductions = taxCode.standardDeduction;
        }
        // switch (result.status) {
        //     case 'single':
        //
        //         break;
        //     case 'married-filing-jointly':
        //
        //         break;
        //     case 'married-filing-separately':
        //
        //         break;
        //     case 'head-of-household':
        //
        //         break;
        //     default:
        //
        // }
        // if ()
        // result.fica = {
        //     w2: ,
        //     sCorp: ,
        //     soleProp:
        // }
    };
}); //End mainService