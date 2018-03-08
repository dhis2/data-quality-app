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
        actionButton: 'validate',
        form: {
            startDate: 'Start Date',
            endDate: 'End Date',
            organisationUnit: 'Parent organisation unit',
            validationRuleGroup: 'Validation Rule Group',
            sendNotifications: 'Send Notifications',
            persistNewResults: 'Persist new results',
        },
    },
    stdDevOutlierAnalysis: {
        homeLabel: 'Std Dev Outlier Analysis',
        homeAction: 'Analyze',
        header: 'Std Dev Outlier Analysis',
        description: 'Analyze potential outlier values based on standard deviations.' +
        ' Outlier values can be examined and marked for follow-up.',
        actionButton: 'start',
        form: {
            startDate: 'Start Date',
            endDate: 'End Date',
            standardDeviations: 'Select number of standard deviations',
            dataSet: 'Data Set',
            organisationUnit: 'Parent organisation unit',
        },
    },
    minMaxOutlierAnalysis: {
        homeLabel: 'Min-Max Outlier Analysis',
        homeAction: 'Analyze',
        header: 'Min-Max Outlier Analysis',
        description: 'Analyze potential outlier values based on min and max values.' +
        ' Outlier values can be examined and marked for follow-up.',
        actionButton: 'start',
        form: {
            startDate: 'Start Date',
            endDate: 'End Date',
            dataSet: 'Data Set',
            organisationUnit: 'Parent organisation unit',
        },
    },
    followUpAnalysis: {
        homeLabel: 'Follow-Up Analysis',
        homeAction: 'View Data Values',
        header: 'Follow-Up Analysis',
        description: 'View or edit data values marked for further follow-up during data entry or analysis.',
        actionButton: 'follow up',
        form: {
            organisationUnit: 'Parent organisation unit',
        },
    },
    availableOrganisationUnitsTree: {
        updatingMessage: 'Updating Organisation Units Tree...',
    },
    validationRuleGroupsSelect: {
        validationRuleGroupLabel: 'Validation Rule Group',
        allValidationRulesOption: '[All Validation Rules]',
    },
    datasetsForOrganisationUnitSelect: {
        dataSetLabel: 'Data Set',
        allDataSetsOption: '[All Data Sets]',
    },
};

export default i18n;
