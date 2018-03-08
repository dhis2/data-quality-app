// Components
import ValidationRulesAnalysis from './validation-rules-analysis/ValidationRulesAnalysis';
import StdDevOutlierAnalysis from './std-dev-outlier-analysis/StdDevOutlierAnalysis';
import MinMaxOutlierAnalysis from './min-max-outlier-analysis/MinMaxOutlierAnalysis';
import FollowUpAnalysis from './follow-up-analysis/FollowUpAnalysis';

export const VALIDATION_RULES_ANALYSIS_SECTION_KEY = 'validationRulesAnalysis';
export const STD_DEV_OUTLIER_ANALYSIS_SECTION_KEY = 'stdDevOutlierAnalysis';
export const MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY = 'minMaxOutlierAnalysis';
export const FOLLOW_UP_ANALYSIS_SECTION_KEY = 'followUpAnalysis';

export const sections = [
    {
        key: VALIDATION_RULES_ANALYSIS_SECTION_KEY,
        path: '/validation-rules-analysis',
        component: ValidationRulesAnalysis,
        info: {
            label: 'Validation Rule Analysis',
            icon: 'done_all',
            description: 'Run validation rules in order to unveil anomalies and errors in the data in the database.',
            actionText: 'Run Validation',
        },
    },
    {
        key: STD_DEV_OUTLIER_ANALYSIS_SECTION_KEY,
        path: '/std-dev-outlier-analysis',
        component: StdDevOutlierAnalysis,
        info: {
            label: 'Std Dev Outlier Analysis',
            icon: 'show_chart',
            description: 'Analyze potential outlier values based on standard deviations. ' +
            'Outlier values can be examined and marked for follow-up.',
            actionText: 'Analyze',
        },
    },
    {
        key: MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY,
        path: '/min-max-outlier-analysis',
        component: MinMaxOutlierAnalysis,
        info: {
            label: 'Min-Max Outlier Analysis',
            icon: 'compare_arrows',
            description: 'Analyze potential outlier values based on min and max values. ' +
            'Outlier values can be examined and marked for follow-up.',
            actionText: 'Analyze',
        },
    },
    {
        key: FOLLOW_UP_ANALYSIS_SECTION_KEY,
        path: '/follow-up-analysis',
        component: FollowUpAnalysis,
        info: {
            label: 'Follow-Up Analysis',
            icon: 'description',
            description: 'View or edit data values marked for further follow-up during data entry or analysis.',
            actionText: 'View Data Values',
        },
    },
];

export default sections;
