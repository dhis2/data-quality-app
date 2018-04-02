export const apiConf = {
    endpoints: {
        validationRulesAnalysis: '/analysis/validationRules',
        validationRulesExpression: '/analysis/validationRulesExpression',
        validationRulesReport: '/analysis/validationRules/report',
        validationRules: '/validationRules',
        minMaxOutliersAnalysis: '/analysis/minMaxOutlier',
        standardDeviationOutliersAnalysis: '/analysis/stdDevOutlier',
        folloupAnalysis: '/analysis/followup',
        markDataValue: '/analysis/followup/mark',
        reportAnalysis: '/analysis/report',
    },
    results: {
        analysis: {
            limit: 500,
        },
    },
};

export default apiConf;
