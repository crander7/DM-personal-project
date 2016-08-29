angular.module('personal').directive('typedDirective', () => {
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {
    //   alertify.defaults.transition = "zoom";
    //   alertify.defaults.theme.ok = "ui positive button";
    //   alertify.defaults.theme.cancel = "ui black button";
      $(() => {
            $(element).typed({
              strings: ["find <strong>Tax Advantages</strong>^300", "structure your business.^300", "<strong>Save Money</strong>.^5000"],
              typeSpeed: 0,
              loop: true
            });
        });
    }
  }
});//End directive
