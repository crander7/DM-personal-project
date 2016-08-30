'use strict';

angular.module('personal', ['ui.router', 'ngAnimate']);
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
    }).state('admin', {
        url: '/admin',
        templateUrl: '../views/admin.html',
        controller: 'mainController',
        resolve: {
            requireAuthentication: function requireAuthentication(userService, $state) {
                // console.log('made it to resolve');
                return userService.checkAuth().then(function (response) {
                    // console.log("resolve checkAuth response: ", response[0]);
                    if (response[0].type === 'admin') {
                        // console.log("made it to admin page");
                        // $state.go('admin');
                    } else {
                        // console.log('redirected home');
                        $state.go('home');
                    }
                });
            }
        }
    }).state('user-data', {
        url: '/user-update',
        templateUrl: '../views/user-data.html',
        controller: 'mainController',
        resolve: {
            requireAuthentication: function requireAuthentication(userService, $state) {
                // console.log('made it to resolve');
                return userService.checkAuth().then(function (response) {
                    // console.log("resolve checkAuth response: ", response[0]);
                    if (response[0].type === 'admin') {
                        // console.log("made it to admin page");
                        // $state.go('admin');
                    } else {
                        // console.log('redirected home');
                        $state.go('home');
                    }
                });
            }
        }
    }).state('bracket-edit', {
        url: '/bracket-edit',
        templateUrl: '../views/bracket-edit.html',
        controller: 'mainController',
        resolve: {
            requireAuthentication: function requireAuthentication(userService, $state) {
                // console.log('made it to resolve');
                return userService.checkAuth().then(function (response) {
                    // console.log("resolve checkAuth response: ", response[0]);
                    if (response[0].type === 'admin') {
                        // console.log("made it to admin page");
                        // $state.go('admin');
                    } else {
                        // console.log('redirected home');
                        $state.go('home');
                    }
                });
            }
        }
    });

    $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('personal').controller('mainController', function ($rootScope, $scope, $state, taxService, userService, mainService) {

    $rootScope.$state = $state;

    $scope.alert = function (calc) {
        swal({
            title: 'We just need to ask you a few questions!',
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: false,
            cancelButtonText: "No thanks",
            animation: 'slide-from-top'
        }, function (ok) {
            if (ok) {
                swal('Okay, lets start!', "", "success");
                $state.go(calc);
            } else {
                swal('Cancelled', "Your request has been cancelled.", 'error');
            }
        });
    };

    var destPicker = function destPicker() {
        if ($scope.done === true) {
            mainService.getTaxData().then(function (response) {
                mainService.getBrackets(response).then(function (result) {
                    console.log(result);
                    $rootScope.report = result;
                    $rootScope.done = true;
                });
            });
            $state.go('business-results');
        } else {
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
        }
    };

    $scope.proceed = function (num, num2) {
        if (num2) {
            if (num2.indexOf(',') > -1) {
                var i = num2.indexOf(',');
                var tempArr = num2.split('');
                tempArr.splice(i, 1);
                num2 = tempArr.join('');
            }
        }
        if (num) {
            if (num.indexOf(',') > -1) {
                var _i = num.indexOf(',');
                var _tempArr = num.split('');
                _tempArr.splice(_i, 1);
                num = _tempArr.join('');
            }
        }
        if (isNaN(num) || num === '' || $state.current.name === 'w2-income' && isNaN(num2) || $state.current.name === 'w2-income' && num2 === undefined) {
            $scope.num = '';
            swal({
                title: "Invalid Entry",
                text: "Please enter a number even if it's zero",
                closeOnConfirm: false,
                allowOutsideClick: true
            }, function (isConfirm) {
                swal("Please click i for more info", "", "info");
            });
        } else {
            mainService.addToClient(num, $state.current.name, num2);
            if ($state.current.name === 'business-expense') {
                mainService.getTaxData().then(function (response) {
                    mainService.getBrackets(response).then(function (result) {
                        console.log(result);
                        $rootScope.report = result;
                        $rootScope.done = true;
                    });
                });
            }
            destPicker();
        }
    };
    //This is what displays the view name for the questionaire
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
            swal({
                title: "Invalid Entry",
                text: "Please enter a number even if it's zero",
                allowOutsideClick: true
            });
        } else {
            if ($rootScope.done === true) {
                mainService.addToClient(val, $state.current.name);
                destPicker();
                $state.go('business-results');
            } else {
                mainService.addToClient(val, $state.current.name);
                destPicker();
            }
        }
    };

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
        swal({
            title: $scope.pageName + ' help',
            text: info,
            allowOutsideClick: true
        });
    };

    $rootScope.resultGate = function () {
        if ($rootScope.done === true) {
            $state.go('business-results');
        } else {
            swal("Denied", "Please finish the assessment to see your Personal Report.", "error");
        }
    };

    $scope.getUser = function (name) {
        console.log('getUser in mainController', name);
        userService.getUser(name).then(function (response) {
            console.log("fetchedUser", response);
            $scope.fetchedUser = response;
            $state.go('user-data');
        });
    };

    $scope.updateUser = function (user) {
        console.log("mainController", user);
        userService.updateUser(user).then(function (response) {
            console.log(response);
            swal({
                title: 'Server message',
                text: response,
                allowOutsideClick: true
            }, function (isConfirm) {
                $state.go('admin');
            });
        });
    };

    $scope.userPrompt = function () {
        swal({
            title: 'Who would you like to grant admin access?',
            text: '',
            type: 'input',
            showCancelButton: true,
            inputPlaceholder: "Name"
        }, function (input) {
            if (input === false) {
                return false;
            }
            if (input === "") {
                swal.showInputError("You need to write something!");
                return false;
            }
            console.log(input);
            $scope.getUser(input);
        });
    };

    $scope.getBrackets = function (status) {
        console.log("initial in controller", status);
        taxService.getBrackets(status).then(function (response) {
            console.log("return to controller after server", response);
            $rootScope.brackets = response;
            console.log($scope.brackets);
            $state.go('bracket-edit');
        });
    };

    $scope.showSuccess = function () {
        swal({
            title: "Success",
            text: "Bracket Successfully Updated",
            allowOutsideClick: true
        });
    };

    (function () {
        if ($state.current.name === 'business-income') {
            $scope.loc = '../assets/revenue.jpg';
        } else if ($state.current.name === 'deductions') {
            $scope.loc = '../assets/deduction.jpg';
        } else if ($state.current.name === 'exemptions') {
            $scope.loc = '../assets/exemptions.jpg';
        } else if ($state.current.name === 'personal-expense') {
            $scope.loc = '../assets/personal.jpg';
        } else if ($state.current.name === 'business-expense') {
            $scope.loc = '../assets/business.png';
        }
    })();

    $scope.background = {
        "background": 'url(' + $scope.loc + ')',
        "background-size": "cover"
    };
}); //End mainController
'use strict';

angular.module('personal').directive('barChart', function () {

  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      setTimeout(function () {

        var margin = {
          top: 20,
          right: 10,
          bottom: 100,
          left: 65
        },
            width = 420 - margin.right - margin.left,
            _height = 450 - margin.top - margin.bottom;

        var svg = d3.select(".graph-container").append("svg").attr({
          "width": width + margin.right + margin.left,
          "height": _height + margin.top + margin.bottom
        }).append("g").attr("transform", "translate(" + margin.left + "," + margin.right + ")");

        // define x and y scales
        var xScale = d3.scale.ordinal().rangeRoundBands([0, width], 0.2, 0.2);

        var yScale = d3.scale.linear().range([_height, 0]);

        // define x axis and y axis
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom");

        var yAxis = d3.svg.axis().scale(yScale).orient("left");

        var data = scope.$root.report.graphNet;

        //   sort the gdp values
        //   data.sort(function(a, b) {
        //       return b.val - a.val;
        //   });

        xScale.domain(data.map(function (d) {
          return d.name;
        }));
        yScale.domain([0, d3.max(data, function (d) {
          return d.val;
        })]);

        svg.selectAll('rect').data(data).enter().append('rect').attr("height", 0).attr("y", _height).transition().duration(2000).delay(function (d, i) {
          return i * 100;
        })
        // attributes can be also combined under one .attr
        .attr({
          "x": function x(d) {
            return xScale(d.name);
          },
          "y": function y(d) {
            return yScale(d.val);
          },
          "width": xScale.rangeBand(),
          "height": function height(d) {
            return _height - yScale(d.val);
          }
        }).style("fill", function (d, i) {
          if (i === 0) {
            return '#62B6CB';
          } else if (i === 1) {
            return '#1B4965';
          } else {
            return '#5FA8D3';
          }
        });

        svg.selectAll('text').data(data).enter().append('text').text(function (d) {
          var splitStr = d.val.toString().split('');
          splitStr.splice(-3, 0, ",");
          splitStr.push(".00");
          var result = splitStr.join('');
          return "$" + result;
        }).attr({
          "x": function x(d) {
            return xScale(d.name) + xScale.rangeBand() / 2;
          },
          "y": function y(d) {
            return yScale(d.val) + 20;
          },
          "font-family": 'sans-serif',
          "font-size": '13px',
          "font-weight": 'bold',
          "fill": 'white',
          "text-anchor": 'middle'
        });

        // Draw xAxis and position the label
        svg.append("g").data(data).attr("class", "x axis").attr("transform", "translate(0," + _height + ")").call(xAxis).selectAll("text").attr("dx", "-.8em").attr("dy", ".75em").style("text-anchor", "middle").attr("font-size", "10px");

        // Draw yAxis and postion the label
        svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("class", "axislabel").style("text-anchor", "middle").attr("x", 0 - _height / 2).attr("dy", "-4.5em").text("Net in Dollars");
      }, 600);
    }

  };
}); //End bar Chart Directive
'use strict';

angular.module('personal').directive('headerdirective', function () {
    return {
        restrict: 'E',
        templateUrl: '../../views/header.html'
    };
}); //End Directive
'use strict';

angular.module('personal').directive('captureDirective', function () {
    return {
        templateUrl: '../../views/input-templ.html',
        restrict: 'E'
    };
});
"use strict";

angular.module("personal").directive("sideNav", function () {
    return {
        restrict: 'E',
        templateUrl: '../../views/sidenav.html',
        link: function link(scope, element, attrs) {
            $('#manage-admin').on('click', function () {
                $('#manage-admin-list').slideToggle();
            });
            $('#manage-brackets').on('click', function () {
                $('#manage-brackets-list').slideToggle();
            });
            $('#view-users').on('click', function () {
                $('#view-users-list').slideToggle();
            });
        }
    };
});
'use strict';

angular.module('personal').directive('typedDirective', function () {
  return {
    restrict: 'A',
    link: function link(scope, element, attrs) {
      //   alertify.defaults.transition = "zoom";
      //   alertify.defaults.theme.ok = "ui positive button";
      //   alertify.defaults.theme.cancel = "ui black button";
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

angular.module('personal').service('mainService', function ($http, $location) {

    var client = {
        filingStatus: '',
        w2Income: '',
        salary: '',
        businessIncome: '',
        deductions: '',
        exemptions: '',
        personalExpense: '',
        businessExpense: ''
    };
    //Test data Delete later
    this.test = function (status, w2Inc, salary, busNet, ded, exemp, personal, busEx) {
        client.filingStatus = status;
        client.w2Income = Number(w2Inc);
        client.salary = Number(salary);
        client.businessIncome = Number(busNet);
        client.deductions = Number(ded);
        client.exemptions = Number(exemp);
        client.personalExpense = Number(personal);
        client.businessExpense = Number(busEx);
    };

    this.addToClient = function (val, loc, val2) {
        if (val2) {
            if (val2.indexOf(',') > -1) {
                var i = val2.indexOf(',');
                val2.splice(i, 1);
            }
        }
        if (val.indexOf(',') > -1) {
            var _i = val.indexOf(',');
            val.splice(_i, 1);
        }
        switch (loc) {
            case 'filing-status':
                client.filingStatus = val;
                break;
            case 'w2-income':
                client.w2Income = Number(val);
                client.salary = Number(val2);
                break;
            case 'business-income':
                client.businessIncome = Number(val);
                break;
            case 'deductions':
                client.deductions = Number(val);
                break;
            case 'exemptions':
                client.exemptions = Number(val);
                break;
            case 'personal-expense':
                client.personalExpense = Number(val);
                break;
            case 'business-expense':
                client.businessExpense = Number(val);
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
            for (var i = 0; i < response.data.length; i++) {
                taxCode[response.data[i].name] = Number(response.data[i].value);
            }
            var startCalc = calcBracket(taxCode);
            return startCalc;
        });
    };

    var calcBracket = function calcBracket(taxCode) {
        var result = {
            status: client.filingStatus,
            w2Wages: client.w2Income,
            sCorpWages: client.salary,
            businessNet: client.businessIncome,
            exemptions: client.exemptions * taxCode.personalExemption,
            personalExpense: client.personalExpense,
            businessExpense: client.businessExpense,
            salary: client.salary

        };
        if (client.deductions >= taxCode.standardDeduction) {
            result.deductions = client.deductions;
        } else {
            result.deductions = taxCode.standardDeduction;
        }
        var w2Fica = void 0;
        var sCorpFica = void 0;
        var solePropFica = void 0;
        if (result.w2Wages > taxCode.socialSecurityWageLimit) {
            w2Fica = Math.round(taxCode.socialSecurityWageLimit * (taxCode.selfEmploymentTax / 2) + (result.w2Wages - taxCode.socialSecurityWageLimit) * (taxCode.medicareTax / 2));
        } else {
            w2Fica = Math.round(result.w2Wages * (taxCode.selfEmploymentTax / 2));
        }
        if (result.salary <= taxCode.socialSecurityWageLimit) {
            sCorpFica = Math.round(result.salary * taxCode.selfEmploymentTax);
        } else {
            sCorpFica = Math.round(taxCode.socialSecuritySelfEmploymentLimit + result.salary * taxCode.medicareTax);
        }
        if ((result.businessNet - result.personalExpense) * (1 - taxCode.selfEmploymentTax / 2) <= taxCode.socialSecurityWageLimit) {
            solePropFica = Math.round((result.businessNet - result.personalExpense) * (1 - taxCode.selfEmploymentTax / 2) * taxCode.selfEmploymentTax);
        } else {
            solePropFica = Math.round(taxCode.socialSecuritySelfEmploymentLimit + (result.businessNet - result.personalExpense) * (1 - taxCode.selfEmploymentTax / 2) * taxCode.medicareTax);
        }
        result.fica = {
            w2: w2Fica,
            sCorp: sCorpFica,
            soleProp: solePropFica
        };
        result.payrollTax = {
            sCorp: Math.round(result.fica.sCorp / 2),
            soleProp: Math.round(result.fica.soleProp / 2)
        };
        result.businessDeductions = {
            sCorp: result.salary + result.payrollTax.sCorp + result.personalExpense + result.businessExpense,
            soleProp: result.payrollTax.soleProp + result.personalExpense
        };
        result.taxableIncome = {
            w2: Math.round(result.w2Wages - result.deductions - result.exemptions),
            sCorp: Math.round(result.salary + result.businessNet - result.businessDeductions.sCorp - result.deductions - result.exemptions),
            soleProp: Math.round(result.businessNet - result.businessDeductions.soleProp - result.deductions - result.exemptions)
        };
        return result;
    };

    this.getBrackets = function (obj) {
        return $http({
            method: 'GET',
            url: '/tax-data/brackets?first=' + obj.taxableIncome.w2 + '&second=' + obj.taxableIncome.sCorp + '&third=' + obj.taxableIncome.soleProp + '&status=' + obj.status
        }).then(function (data) {
            var result = data.data;
            var brackets = {};
            brackets.fedTaxRate = {
                w2: {
                    rate: Number(result[0].rate),
                    plus: Number(result[0].plus),
                    bottom: Number(result[0].bottom)
                },
                sCorp: {
                    rate: Number(result[1].rate),
                    plus: Number(result[1].plus),
                    bottom: Number(result[1].bottom)
                },
                soleProp: {
                    rate: Number(result[2].rate),
                    plus: Number(result[2].plus),
                    bottom: Number(result[2].bottom)
                }
            };
            var report = calcFederalIncomeTax(obj, brackets);
            report.graphNet = [{
                name: 'W2 Employment',
                val: report.totalNet.w2
            }, {
                name: 'S Corporation',
                val: report.totalNet.sCorp
            }, {
                name: 'Sole Proprietorship',
                val: report.totalNet.soleProp
            }];
            obj.w2Wages = formater(obj.w2Wages);
            obj.businessNet = formater(obj.businessNet);
            obj.totalTax.w2 = formater(obj.totalTax.w2);
            obj.totalTax.sCorp = formater(obj.totalTax.sCorp);
            obj.totalTax.soleProp = formater(obj.totalTax.soleProp);
            obj.businessExpense = formater(obj.businessExpense);
            obj.totalExpense.sCorp = formater(obj.totalExpense.sCorp);
            obj.totalExpense.soleProp = formater(obj.totalExpense.soleProp);
            obj.totalNet.w2 = formater(obj.totalNet.w2);
            obj.totalNet.sCorp = formater(obj.totalNet.sCorp);
            obj.totalNet.soleProp = formater(obj.totalNet.soleProp);
            return report;
        });
    };

    var calcFederalIncomeTax = function calcFederalIncomeTax(obj, brackets) {
        obj.federalIncomeTax = {};
        obj.totalTax = {};
        obj.effectiveTaxRate = {};
        obj.totalExpense = {};
        obj.totalNet = {};
        var stageOne = calcSCorpFederal(obj, brackets);
        var stageTwo = calcSolePropFederal(stageOne, brackets);
        if (brackets.fedTaxRate.w2.rate === 0.10) {
            stageTwo.federalIncomeTax.w2 = Math.round(stageTwo.taxableIncome.w2 * brackets.fedTaxRate.w2.rate);
        } else {
            stageTwo.federalIncomeTax.w2 = Math.round(brackets.fedTaxRate.w2.plus + (stageTwo.taxableIncome.w2 - brackets.fedTaxRate.w2.bottom) * brackets.fedTaxRate.w2.rate);
        }
        stageTwo.totalTax.w2 = stageTwo.federalIncomeTax.w2 + stageTwo.fica.w2;
        stageTwo.totalNet.w2 = Math.round(stageTwo.w2Wages - stageTwo.totalTax.w2);
        stageTwo.effectiveTaxRate.w2 = Math.round(stageTwo.totalTax.w2 / stageTwo.w2Wages * 100);
        var completedObj = stageTwo;
        return completedObj;
    };
    var calcSCorpFederal = function calcSCorpFederal(obj, brackets) {
        if (brackets.fedTaxRate.sCorp.rate === 0.10) {
            obj.federalIncomeTax.sCorp = Math.round(obj.taxableIncome.sCorp * brackets.fedTaxRate.sCorp.rate);
        } else {
            obj.federalIncomeTax.sCorp = Math.round(brackets.fedTaxRate.sCorp.plus + (obj.taxableIncome.sCorp - brackets.fedTaxRate.sCorp.bottom) * brackets.fedTaxRate.sCorp.rate);
        }
        obj.totalTax.sCorp = obj.federalIncomeTax.sCorp + obj.fica.sCorp;
        obj.totalExpense.sCorp = obj.businessExpense + obj.totalTax.sCorp;
        obj.totalNet.sCorp = Math.round(obj.businessNet - obj.totalExpense.sCorp);
        obj.effectiveTaxRate.sCorp = Math.round(obj.totalTax.sCorp / obj.businessNet * 100);
        return obj;
    };
    var calcSolePropFederal = function calcSolePropFederal(obj, brackets) {
        if (brackets.fedTaxRate.soleProp.rate === 0.10) {
            obj.federalIncomeTax.soleProp = Math.round(obj.taxableIncome.soleProp * brackets.fedTaxRate.soleProp.rate);
        } else {
            obj.federalIncomeTax.soleProp = Math.round(brackets.fedTaxRate.soleProp.plus + (obj.taxableIncome.soleProp - brackets.fedTaxRate.soleProp.bottom) * brackets.fedTaxRate.soleProp.rate);
        }
        obj.totalTax.soleProp = obj.federalIncomeTax.soleProp + obj.fica.soleProp;
        obj.totalExpense.soleProp = obj.totalTax.soleProp;
        obj.totalNet.soleProp = Math.round(obj.businessNet - obj.totalExpense.soleProp);
        obj.effectiveTaxRate.soleProp = Math.round(obj.totalTax.soleProp / obj.businessNet * 100);
        return obj;
    };

    var formater = function formater(val) {
        var splitStr = val.toString().split('');
        splitStr.splice(-3, 0, ",");
        // splitStr.push(".00");
        var result = splitStr.join('');
        return result;
    };
}); //End mainService
'use strict';

angular.module('personal').service('taxService', function ($http) {

    this.getBrackets = function (status) {
        console.log("service", status);
        return $http({
            method: 'GET',
            url: '/brackets/' + status
        }).then(function (response) {
            console.log("response from server in service", response, response.data);
            return response.data;
        });
    };
}); //End Service
'use strict';

angular.module('personal').service('userService', function ($http, $rootScope) {

    this.checkAuth = function () {
        // console.log("made it to checkAuth inside service");
        return $http({
            method: 'GET',
            url: '/me'
        }).then(function (response) {
            // console.log("userService response: ", response);
            $rootScope.user = response.data[0];
            return response.data;
        });
    };

    this.getUser = function (name) {
        var userName = name.split(' ').join(',');
        return $http({
            method: 'GET',
            url: '/user/' + userName
        }).then(function (response) {
            console.log("response in service return", response.data[0]);
            return response.data[0];
        });
    };

    this.updateUser = function (data) {
        return $http({
            method: 'PUT',
            url: '/user',
            data: data
        }).then(function (response) {
            console.log("service", response);
            if (response.status === 200) {
                return "User successfully updated";
            } else {
                return "Error try again";
            }
        });
    };
}); //End Service