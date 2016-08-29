angular.module("personal").directive("sideNav", () => {
    return {
        restrict: 'E',
        templateUrl: '../../views/sidenav.html',
        link: (scope, element, attrs) => {
            $('#manage-admin').on('click', () => {
                $('#manage-admin-list').slideToggle();
            });
            $('#manage-brackets').on('click', () => {
                $('#manage-brackets-list').slideToggle();
            });
            $('#view-users').on('click', () => {
                $('#view-users-list').slideToggle();
            });
        }
    };
});
