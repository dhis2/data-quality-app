export const apiConf = {
    endpoints: {
        validationRulesAnalysis: '/dataAnalysis/validationRules',
        validationRulesExpression: '/dataAnalysis/validationRulesExpression',
        validationRulesReport: '/dataAnalysis/validationRules/report',
        validationRules: '/validationRules',
        markOutlierDataValue: '/dataValues/followup',
        reportAnalysis: '/dataAnalysis/report',
    },
    results: {
        analysis: {
            limit: 500,
        },
    },
}

export default apiConf
