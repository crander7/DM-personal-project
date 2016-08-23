angular.module('personal').service('mainService', function($http) {

    let client = {
        filingStatus: '',
        w2Income: '',
        salary: '',
        businessIncome: '',
        deductions: '',
        exemptions: '',
        personalExpense: '',
        businessExpense: ''
    };

    this.addToClient = (val, loc, val2) => {
        switch (loc) {
            case 'filing-status':
                client.filingStatus = val;
                break;
            case 'w2-income':
                client.w2Income = Number(val);
                client.salary = Number(val2);
                break;
            case 'business-income':
                client.businessIncome = Number(val);
                break;
            case 'deductions':
                client.deductions = Number(val);
                break;
            case 'exemptions':
                client.exemptions = Number(val);
                break;
            case 'personal-expense':
                client.personalExpense = Number(val);
                break;
            case 'business-expense':
                client.businessExpense = Number(val);
                break;
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
            for (var i = 0; i < response.data.length; i++) {
                taxCode[response.data[i].name] = Number(response.data[i].value);
            }
            let startCalc = calcBracket(taxCode);
            return startCalc;
        });
    };

    let calcBracket = taxCode => {
        let result = {
            status: client.filingStatus,
            w2Wages: client.w2Income,
            sCorpWages: client.salary,
            businessNet: client.businessIncome,
            exemptions: (client.exemptions * taxCode.personalExemption),
            personalExpense: client.personalExpense,
            businessExpense: client.businessExpense,
            salary: client.salary,

        };
        if (client.deductions >= taxCode.standardDeduction) {
            result.deductions = client.deductions;
        } else {
            result.deductions = taxCode.standardDeduction;
        }
        let w2Fica;
        let sCorpFica;
        let solePropFica;
        if (result.w2Wages > taxCode.socialSecurityWageLimit) {
            w2Fica = Math.round(((taxCode.socialSecurityWageLimit * (taxCode.selfEmploymentTax / 2)) + ((result.w2Wages - taxCode.socialSecurityWageLimit) * (taxCode.medicareTax / 2))));
        } else {
            w2Fica = Math.round((result.w2Wages * (taxCode.selfEmploymentTax / 2)));
        }
        if (result.salary <= taxCode.socialSecurityWageLimit) {
            sCorpFica = Math.round((result.salary * taxCode.selfEmploymentTax));
        } else {
            sCorpFica = Math.round((taxCode.socialSecuritySelfEmploymentLimit + (result.salary * taxCode.medicareTax)));
        }
        if (((result.businessNet - result.personalExpense) * (1 - (taxCode.selfEmploymentTax / 2))) <= taxCode.socialSecurityWageLimit) {
            solePropFica = Math.round((((result.businessNet - result.personalExpense) * (1 - (taxCode.selfEmploymentTax / 2))) * taxCode.selfEmploymentTax));
        } else {
            solePropFica = Math.round((taxCode.socialSecuritySelfEmploymentLimit + (((result.businessNet - result.personalExpense) * (1 - (taxCode.selfEmploymentTax / 2))) * taxCode.medicareTax)));
        }
        result.fica = {
            w2: w2Fica,
            sCorp: sCorpFica,
            soleProp: solePropFica
        };
        result.payrollTax = {
            sCorp: Math.round((result.fica.sCorp / 2)),
            soleProp: Math.round((result.fica.soleProp / 2))
        };
        result.businessDeductions = {
            sCorp: (result.salary + result.payrollTax.sCorp + result.personalExpense + result.businessExpense),
            soleProp: (result.payrollTax.soleProp + result.personalExpense)
        };
        result.taxableIncome = {
            w2: Math.round((result.w2Wages - result.deductions - result.exemptions)),
            sCorp: Math.round((result.salary + result.businessNet - result.businessDeductions.sCorp - result.deductions - result.exemptions)),
            soleProp: Math.round((result.businessNet - result.businessDeductions.soleProp - result.deductions - result.exemptions))
        };
        return result;
    };

    this.getBrackets = obj => {
        return $http({
            method: 'GET',
            url: `/tax-data/brackets?first=${obj.taxableIncome.w2}&second=${obj.taxableIncome.sCorp}&third=${obj.taxableIncome.soleProp}&status=${obj.status}`
        }).then(data => {
            let result = data.data;
            let brackets = {};
            brackets.fedTaxRate = {
                w2: {
                    rate: Number(result[0].rate),
                    plus: Number(result[0].plus),
                    bottom: Number(result[0].bottom)
                },
                sCorp: {
                    rate: Number(result[1].rate),
                    plus: Number(result[1].plus),
                    bottom: Number(result[1].bottom)
                },
                soleProp: {
                    rate: Number(result[2].rate),
                    plus: Number(result[2].plus),
                    bottom: Number(result[2].bottom)
                }
            };
            let report = calcFederalIncomeTax(obj, brackets);
            return report;
        });
    };

    let calcFederalIncomeTax = (obj, brackets) => {
        obj.federalIncomeTax = {};
        obj.totalTax = {};
        obj.effectiveTaxRate = {};
        obj.totalExpense = {};
        obj.totalNet = {};
        let stageOne = calcSCorpFederal(obj, brackets);
        let stageTwo = calcSolePropFederal(stageOne, brackets);
        if (brackets.fedTaxRate.w2.rate === 0.10) {
            stageTwo.federalIncomeTax.w2 = Math.round(stageTwo.taxableIncome.w2 * brackets.fedTaxRate.w2.rate);
        } else {
            stageTwo.federalIncomeTax.w2 = Math.round((brackets.fedTaxRate.w2.plus + ((stageTwo.taxableIncome.w2 - brackets.fedTaxRate.w2.bottom) * brackets.fedTaxRate.w2.rate)));
        }
        stageTwo.totalTax.w2 = (stageTwo.federalIncomeTax.w2 + stageTwo.fica.w2);
        stageTwo.totalNet.w2 = stageTwo.w2Wages - stageTwo.totalTax.w2;
        stageTwo.effectiveTaxRate.w2 = Math.round((stageTwo.totalTax.w2 / stageTwo.w2Wages) * 100);
        let completedObj = stageTwo;
        return completedObj;
    };
    let calcSCorpFederal = (obj, brackets) => {
        if (brackets.fedTaxRate.sCorp.rate === 0.10) {
            obj.federalIncomeTax.sCorp = Math.round(obj.taxableIncome.sCorp * brackets.fedTaxRate.sCorp.rate);
        } else {
            obj.federalIncomeTax.sCorp = Math.round((brackets.fedTaxRate.sCorp.plus + ((obj.taxableIncome.sCorp - brackets.fedTaxRate.sCorp.bottom) * brackets.fedTaxRate.sCorp.rate)));
        }
        obj.totalTax.sCorp = (obj.federalIncomeTax.sCorp + obj.fica.sCorp);
        obj.totalExpense.sCorp = (obj.businessExpense + obj.totalTax.sCorp);
        obj.totalNet.sCorp = obj.businessNet - obj.totalExpense.sCorp;
        obj.effectiveTaxRate.sCorp = Math.round((obj.totalTax.sCorp / obj.businessNet) * 100);
        return obj;
    };
    let calcSolePropFederal = (obj, brackets) => {
        if (brackets.fedTaxRate.soleProp.rate === 0.10) {
            obj.federalIncomeTax.soleProp = Math.round(obj.taxableIncome.soleProp * brackets.fedTaxRate.soleProp.rate);
        } else {
            obj.federalIncomeTax.soleProp = Math.round((brackets.fedTaxRate.soleProp.plus + ((obj.taxableIncome.soleProp - brackets.fedTaxRate.soleProp.bottom) * brackets.fedTaxRate.soleProp.rate)));
        }
        obj.totalTax.soleProp = (obj.federalIncomeTax.soleProp + obj.fica.soleProp);
        obj.totalExpense.soleProp = obj.totalTax.soleProp;
        obj.totalNet.soleProp = obj.businessNet - obj.totalExpense.soleProp;
        obj.effectiveTaxRate.soleProp = Math.round((obj.totalTax.soleProp / obj.businessNet) * 100);
        return obj;
    };

}); //End mainService
