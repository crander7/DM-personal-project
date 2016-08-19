angular.module('personal').controller('mainController', ($rootScope, $scope, $state, mainService) => {

    $rootScope.$state = $state;

    $scope.alert = calc => {
        alertify.alert("Heads Up", "We just need to ask you a few questions!", () => {
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
