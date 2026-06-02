/** @type {import('@dhis2/cli-app-scripts').D2Config} */
const config = {
    id: 'c7d71f92-2a78-4350-b9a7-c399b26a90d6',
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
    minDHIS2Version: '2.38',
}

module.exports = config
