angular.module('personal').service('taxService', function($http) {

    this.getBrackets = status => {
        console.log("service", status);
        return $http({
            method: 'GET',
            url: `/brackets/${status}`
        }).then(response => {
            console.log("response from server in service", response, response.data);
            return response.data;
        });
    };

});//End Service
