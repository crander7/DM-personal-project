angular.module('personal').directive('captureDirective', () => {
    return {
        templateUrl: '../../views/input-templ.html',
        restrict: 'E'
    };
});
