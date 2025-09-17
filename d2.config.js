/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    type: 'app',
    name: 'data-quality',
    title: 'Data Quality',
    coreApp: true,

    entryPoints: {
        app: './src/App.jsx',
    },
    shortcuts: [
        {
            name: 'Validation rule analysis',
            url: '#/validation-rules-analysis',
        },
        {
            name: 'Outlier detection',
            url: '#/outlier-detection',
        },
        {
            name: 'Follow-up analysis',
            url: '#/follow-up-analysis',
        },
    ],
}

module.exports = config
