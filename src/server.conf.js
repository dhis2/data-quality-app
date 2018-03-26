export const apiConf = {
    endpoints: {
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
