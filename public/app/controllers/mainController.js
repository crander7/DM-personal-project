angular.module('personal').controller('mainController', ($rootScope, $scope, $state, taxService, userService, mainService) => {

    $rootScope.$state = $state;

    $scope.alert = calc => {
        swal({
            title: 'We just need to ask you a few questions!',
            showCancelButton: true,
            closeOnConfirm: false,
            closeOnCancel: false,
            cancelButtonText: "No thanks",
            animation: 'slide-from-top'
        }, ok => {
            if (ok) {
                swal('Okay, lets start!', "", "success");
                $state.go(calc);
            }
            else {
                swal('Cancelled', "Your request has been cancelled.", 'error');
            }
        });
    };

    let destPicker = () => {
        if ($scope.done === true) {
            mainService.getTaxData().then(response => {
                mainService.getBrackets(response).then(result => {
                    console.log(result);
                    $rootScope.report = result;
                    $rootScope.done = true;
                });
            });
            $state.go('business-results');
        }
        else {
            let state = $state.current.name;
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
                break
                default:
                $state.go('home');
            }
        }
    };

    $scope.proceed = (num, num2) => {
        if (num2) {
            if (num2.indexOf(',') > -1) {
                let i = num2.indexOf(',');
                let tempArr = num2.split('');
                tempArr.splice(i, 1);
                num2 = tempArr.join('');
            }
        }
        if (num) {
            if (num.indexOf(',') > -1) {
                let i = num.indexOf(',');
                let tempArr = num.split('');
                tempArr.splice(i, 1);
                num = tempArr.join('');
            }
        }
        if (isNaN(num) || num === '' || ($state.current.name === 'w2-income' && isNaN(num2)) || ($state.current.name === 'w2-income' && num2 === undefined)) {
            $scope.num = '';
            swal({
                title: "Invalid Entry",
                text: "Please enter a number even if it's zero",
                closeOnConfirm: false,
                allowOutsideClick: true
            }, isConfirm => {
                swal("Please click i for more info", "", "info");
            });

        }
        else {
            mainService.addToClient(num, $state.current.name, num2);
            if ($state.current.name === 'business-expense') {
                mainService.getTaxData().then(response => {
                    mainService.getBrackets(response).then(result => {
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
    (() => {
        let rawName = $state.current.name;
        let nameArr = [];
        let result = '';
        if (rawName.includes('-')) {
            rawName = rawName.split('-');
            nameArr.push(rawName[0].charAt(0).toUpperCase() + rawName[0].slice(1));
            nameArr.push(rawName[1].charAt(0).toUpperCase() + rawName[1].slice(1));
            result = nameArr.join(" ");
        }
        else {
            rawName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            result = rawName;
        }
        $scope.pageName = result;
    })();

    $scope.filer = null;
    $scope.radioCheck = (val) => {
        if (val === null) {
            swal({
                title: "Invalid Entry",
                text: "Please enter a number even if it's zero",
                allowOutsideClick: true
            });
        }
        else {
            if ($rootScope.done === true) {
                mainService.addToClient(val, $state.current.name);
                destPicker();
                $state.go('business-results');
            }
            else {
                mainService.addToClient(val, $state.current.name);
                destPicker();
            }
        }
    };

    $scope.showHelp = () => {
        let page = $state.current.name;
        let info = '';
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
                break
            default:
                info = "Unable to find help for this topic";
        }
        swal({
            title: `${$scope.pageName} help`,
            text: info,
            allowOutsideClick: true
        });
    };

    $rootScope.resultGate = () => {
        if ($rootScope.done === true) {
            $state.go('business-results');
        }
        else {
            swal("Denied", "Please finish the assessment to see your Personal Report.", "error");
        }
    };

    $scope.getUser = name => {
        console.log('getUser in mainController', name);
        userService.getUser(name).then(response => {
            console.log("fetchedUser", response);
            $scope.fetchedUser = response;
            $state.go('user-data');
        });
    };

    $scope.updateUser = user => {
        console.log("mainController", user);
        userService.updateUser(user).then(response => {
            console.log(response);
            swal({
                title: 'Server message',
                text: response,
                allowOutsideClick: true,
            }, isConfirm => {
                $state.go('admin');
            });
        });
    };

    $scope.userPrompt = () => {
        swal({
            title: 'Who would you like to grant admin access?',
            text: '',
            type: 'input',
            showCancelButton: true,
            inputPlaceholder: "Name"
        }, input => {
            if (input === false) {
                return false;
            }
            if (input === "") {
                swal.showInputError("You need to write something!");
                return false
            }
            console.log(input);
            $scope.getUser(input);
        });
    };

    $scope.getBrackets = (status) => {
        console.log("initial in controller", status);
        taxService.getBrackets(status).then(response => {
            console.log("return to controller after server", response);
            $rootScope.brackets = response;
            console.log($scope.brackets);
            $state.go('bracket-edit');
        });
    };

    $scope.showSuccess = () => {
        swal({
            title: "Success",
            text: "Bracket Successfully Updated",
            allowOutsideClick: true
        });
    };


    (() => {
        if ($state.current.name === 'business-income') {
            $scope.loc = '../assets/revenue.jpg';
        }
        else if ($state.current.name === 'deductions') {
            $scope.loc = '../assets/deduction.jpg';
        }
        else if ($state.current.name === 'exemptions') {
            $scope.loc = '../assets/exemptions.jpg';
        }
        else if ($state.current.name === 'personal-expense') {
            $scope.loc = '../assets/personal.jpg';
        }
        else if ($state.current.name === 'business-expense') {
            $scope.loc = '../assets/business.png';
        }
    })();

    $scope.background = {
        "background": `url(${$scope.loc})`,
        "background-size": "cover"
    };




}); //End mainController
