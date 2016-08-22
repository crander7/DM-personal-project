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
