import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import { reactI18nextModule } from 'react-i18next';

i18n
    .use(Backend)
    .use(reactI18nextModule)
    .init({
        debug: false /* process.env.NODE_ENV === 'development' */,
        returnEmptyString: false,
        fallbackLng: false,
        keySeparator: '|',
        backend: {
            loadPath: './i18n/{{lng}}.json',
        },
        react: {
            wait: true,
        },
    });

export const i18nKeys = {
    validationRulesAnalysis: {
        homeLabel: 'Validation Rule Analysis',
        homeAction: 'Run Validation',
        header: 'Validation Rule Analysis',
        description: 'Run validation rules in order to unveil anomalies and errors in the data in the database.',
    },
    stdDevOutlierAnalysis: {
        homeLabel: 'Std Dev Outlier Analysis',
        homeAction: 'Analyze',
        header: 'Std Dev Outlier Analysis',
        description: 'Analyze potential outlier values based on standard deviations.' +
        ' Outlier values can be examined and marked for follow-up.',
    },
    minMaxOutlierAnalysis: {
        homeLabel: 'Min-Max Outlier Analysis',
        homeAction: 'Analyze',
        header: 'Min-Max Outlier Analysis',
        description: 'Analyze potential outlier values based on min and max values.' +
        ' Outlier values can be examined and marked for follow-up.',
    },
    followUpAnalysis: {
        homeLabel: 'Follow-Up Analysis',
        homeAction: 'View Data Values',
        header: 'Follow-Up Analysis',
        description: 'View or edit data values marked for further follow-up during data entry or analysis.',
    },
};

export default i18n;
