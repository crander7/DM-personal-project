angular.module('personal').controller('mainController', ($rootScope, $scope, $state, taxService, userService, mainService) => {

    $rootScope.$state = $state;

    $scope.alert = calc => {
        // alertify.alert("Heads Up", "We just need to ask you a few questions!", () => {
        //     alertify.success('Ok, Lets Start!');
        //     $state.go(calc);
        // }).set({
        //     transition: 'slide',
        //     movable: false
        // }).show();
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
    };

    $scope.proceed = (num, num2) => {
        if (isNaN(num) || num === '' || ($state.current.name === 'w2-income' && isNaN(num2))) {
            $scope.num = '';
            // alertify.alert("Invalid Entry", "Please enter a number even if its a 0.", () => {
            //     alertify.message('click i for more info.');
            // }).set({
            //     transition: 'slide',
            //     movable: false
            // }).show();
            swal({
                title: "Invalid Entry",
                text: "Please enter a number even if it's zero",
                closeOnConfirm: false,
                allowOutsideClick: true
            }, isConfirm => {
                swal("Please click i for more info", "", "information");
            });

        }
        else {
            // alertify.success('Awesome!');
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

    $scope.reProcess = (num, num2) => {
        if (num) {
            mainService.addToClient(num, $state.current.name, num2);
        }
        mainService.getTaxData().then(response => {
            mainService.getBrackets(response).then(result => {
                console.log(result);
                $rootScope.report = result;
                $rootScope.done = true;
            });
        });
        $state.go('business-results');
    };

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
            // alertify.alert("Error", "Please select a filing status.", () => {
            //     alertify.message("Click i for more information");
            // }).set({
            //     transition: 'slide',
            //     movable: false
            // }).show();
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

    $scope.runTest = () => {
        mainService.test('married-filing-jointly', '100000', '60000', '110000', '15000', '4', '3500', '2800');
        mainService.getTaxData().then(response => {
            mainService.getBrackets(response).then(result => {
                console.log(result);
                $rootScope.report = result;
                $rootScope.done = true;
            });
        });
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
        // alertify.alert(`${$scope.pageName} help`, info, () => {
        //
        // }).set({
        //     transition: 'zoom',
        //     movable: false
        // }).show();
        swal({
            title: `${$scope.pageName} help`,
            text: info,
            allowOutsideClick: true
        });
    };

    $rootScope.resultGate = () => {
        console.log($rootScope.done);
        if ($rootScope.done === true) {
            $state.go('business-results');
        }
        else {
            // alertify.alert("Denied", "Please finish answering the questions to see your Personal Report", () => {

            // }).show();
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
            // alertify.alert('Server message', response, () => {
            //     $state.go('admin');
            // }).show();
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
        // alertify.prompt("Who would you like to add as an admin?", "Name", (evt, value) => {
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
        // });
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
}); //End mainController
