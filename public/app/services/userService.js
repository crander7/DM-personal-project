angular.module('personal').service('userService', function($http, $rootScope) {

    this.checkAuth = () => {
        // console.log("made it to checkAuth inside service");
        return $http({
            method: 'GET',
            url: '/me'
        }).then(response => {
            // console.log("userService response: ", response);
            $rootScope.user = response.data[0];
            return response.data;
        });
    };

    this.getUser = name => {
        let userName = name.split(' ').join(',');
        return $http({
            method: 'GET',
            url: `/user/${userName}`
        }).then(response => {
            console.log("response in service return", response.data[0]);
            return response.data[0];
        });
    };

    this.updateUser = data => {
        return $http({
            method: 'PUT',
            url: '/user',
            data: data
        }).then(response => {
            console.log("service", response);
            if (response.status === 200) {
                return "User successfully updated";
            }
            else {
                return "Error try again";
            }
        });
    };
});//End Service
