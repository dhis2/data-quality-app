// Components
import ValidationRulesAnalysis from './validation-rules-analysis/ValidationRulesAnalysis';
import StdDevOutlierAnalysis from './std-dev-outlier-analysis/StdDevOutlierAnalysis';
import MinMaxOutlierAnalysis from './min-max-outlier-analysis/MinMaxOutlierAnalysis';
import FollowUpAnalysis from './follow-up-analysis/FollowUpAnalysis';

// i18n
import { i18nKeys } from '../i18n';

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
            label: i18nKeys.validationRulesAnalysis.homeLabel,
            icon: 'done_all',
            description: i18nKeys.validationRulesAnalysis.description,
            actionText: i18nKeys.validationRulesAnalysis.homeAction,
        },
    },
    {
        key: STD_DEV_OUTLIER_ANALYSIS_SECTION_KEY,
        path: '/std-dev-outlier-analysis',
        component: StdDevOutlierAnalysis,
        info: {
            label: i18nKeys.stdDevOutlierAnalysis.homeLabel,
            icon: 'show_chart',
            description: i18nKeys.stdDevOutlierAnalysis.description,
            actionText: i18nKeys.stdDevOutlierAnalysis.homeAction,
        },
    },
    {
        key: MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY,
        path: '/min-max-outlier-analysis',
        component: MinMaxOutlierAnalysis,
        info: {
            label: i18nKeys.minMaxOutlierAnalysis.homeLabel,
            icon: 'compare_arrows',
            description: i18nKeys.minMaxOutlierAnalysis.description,
            actionText: i18nKeys.minMaxOutlierAnalysis.homeAction,
        },
    },
    {
        key: FOLLOW_UP_ANALYSIS_SECTION_KEY,
        path: '/follow-up-analysis',
        component: FollowUpAnalysis,
        info: {
            label: i18nKeys.followUpAnalysis.homeLabel,
            icon: 'description',
            description: i18nKeys.followUpAnalysis.description,
            actionText: i18nKeys.followUpAnalysis.homeAction,
        },
    },
];

export default sections;
