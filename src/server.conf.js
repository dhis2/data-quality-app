export const apiConf = {
    endpoints: {
        validationRulesAnalysis: '/dataAnalysis/validationRules',
        validationRulesExpression: '/dataAnalysis/validationRulesExpression',
        validationRulesReport: '/dataAnalysis/validationRules/report',
        validationRules: '/validationRules',
        minMaxOutliersAnalysis: '/dataAnalysis/minMaxOutlier',
        standardDeviationOutliersAnalysis: '/dataAnalysis/stdDevOutlier',
        folloupAnalysis: '/dataAnalysis/followup',
        markDataValue: '/dataAnalysis/followup/mark',
        reportAnalysis: '/dataAnalysis/report',
    },
    results: {
        analysis: {
            limit: 500,
        },
    },
};

export default apiConf;
