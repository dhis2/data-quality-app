export const apiConf = {
    endpoints: {
        validationRulesAnalysis: '/dataAnalysis/validationRules',
        validationRulesExpression: '/dataAnalysis/validationRulesExpression',
        validationRulesReport: '/dataAnalysis/validationRules/report',
        validationRules: '/validationRules',
        outlierDetection: '/outlierDetection',
        folloupAnalysis: '/dataAnalysis/followup',
        markOutlierDataValue: '/dataValues/followup',
        markFollowUpDataValue: '/dataAnalysis/followup/mark',
        reportAnalysis: '/dataAnalysis/report',
    },
    results: {
        analysis: {
            limit: 500,
        },
    },
}

export default apiConf
