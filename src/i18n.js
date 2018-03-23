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
    availableOrganisationUnitsTree: {
        updatingMessage: 'Updating Organisation Units Tree...',
    },
    datasetsForOrganisationUnitSelect: {
        dataSetLabel: 'Data Set',
        allDataSetsOption: '[All Data Sets]',
    },
    downloadAs: {
        pdf: 'DOWNLOAD AS PDF',
        xls: 'DOWNLOAD AS XLS',
        csv: 'DOWNLOAD AS CSV',
    },
    followUpAnalysis: {
        homeLabel: 'Follow-Up Analysis',
        homeAction: 'View Data Values',
        header: 'Follow-Up Analysis',
        description: 'View or edit data values marked for further follow-up during data entry or analysis.',
        actionButtonFollow: 'follow up',
        actionButtonUnfollow: 'unfollow',
        form: {
            organisationUnit: 'Parent organisation unit',
            startDate: 'Start Date',
            endDate: 'End Date',
        },
        tableHeaderColumn: {
            dataElement: 'Data Element',
            organisationUnit: 'Organisation Unit',
            period: 'Period',
            min: 'Min',
            value: 'Value',
            max: 'Max',
            unfollow: 'Unfollow',
            comment: 'Comment',
        },
    },
    moreThan500: 'More than 500 values found, please narrow the search to see all',
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
    outlierAnalysisTable: {
        tableHeaderColumn: {
            dataElement: 'Data Element',
            organisationUnit: 'Organisation Unit',
            period: 'Period',
            min: 'Min',
            value: 'Value',
            max: 'Max',
            mark: 'Mark',
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
        tableHeaderColumn: {
            organisationUnit: 'Organisation Unit',
            period: 'Period',
            importance: 'Importance',
            validationRule: 'Validation Rule',
            value: 'Value',
            operator: 'Operator',
            details: 'Details',
        },
        details: {
            dialogTitle: 'Validation Details',
            resultSectionTitle: 'VALIDATIONS RESULT DETAILS',
            rule: {
                subTitle: 'VALIDATION RULE',
                nameLabel: 'Name',
                descriptionLabel: 'Description',
            },
            leftSideSectionTitle: 'LEFT SIDE',
            rightSideSectionTitle: 'RIGHT SIDE',
            dataElementLabel: 'DATA ELEMENT',
            valueLabel: 'VALUE',
            close: 'Close',
        },
    },
    validationRuleGroupsSelect: {
        validationRuleGroupLabel: 'Validation Rule Group',
        allValidationRulesOption: '[All Validation Rules]',
    },
};

export default i18n;
