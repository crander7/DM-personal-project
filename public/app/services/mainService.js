angular.module('personal').service('mainService', function($http) {

    let client = {
        filingStatus: '',
        w2Income: '',
        businessIncome: '',
        deductions: '',
        exemptions: '',
        personalExpense: '',
        businessExpense: ''
    };

    this.addToClient = (val, loc) => {
        switch (loc) {
            case 'filing-status':
                client.filingStatus = val;
                break;
            case 'w2-income':
                client.w2Income = val;
                break;
            case 'business-income':
                client.businessIncome = val;
                break;
            case 'deductions':
                client.deductions = val;
                break;
            case 'exemptions':
                client.exemptions = val;
                break;
            case 'personal-expense':
                client.personalExpense = val;
                break;
            case 'business-expense':
                client.businessExpense = val;
                break
            default:
                alertify.alert('Error', 'Value not added to client');
        }
    };

    this.getTaxData = () => {
        let taxCode = {};
        return $http({
            method: 'GET',
            url: `/tax-data?status=${client.filingStatus}`
        }).then(response => {
            for (var i = 0; i < response.length; i++) {
                taxCode.response[i].name = response[i].value;
            }
            let startCalc = calcBracket(taxCode);
            return report;
        });
    };

    let calcBracket = taxCode => {
        let result = {
                status: client.filingStatus,
                w2Wages: client.w2Income,
                // sCorpWages: ,
                businessNet: client.businessIncome,
                exemptions: (client.exemptions * taxCode.personalExemption),
                personalExpense: client.personalExpense,
                businessExpense: client.businessExpense,
                // salary: client.sCorpWages,

        };
        if (client.deductions >= taxCode.standardDeduction) {
            result.deductions = client.deductions;
        }
        else {
            result.deductions = taxCode.standardDeduction;
        }
        // switch (result.status) {
        //     case 'single':
        //
        //         break;
        //     case 'married-filing-jointly':
        //
        //         break;
        //     case 'married-filing-separately':
        //
        //         break;
        //     case 'head-of-household':
        //
        //         break;
        //     default:
        //
        // }
        // if ()
        // result.fica = {
        //     w2: ,
        //     sCorp: ,
        //     soleProp:
        // }

    };

}); //End mainService
