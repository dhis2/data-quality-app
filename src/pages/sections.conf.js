import ValidationRulesAnalysis from './validation-rules-analysis/ValidationRulesAnalysis'
import i18n from '@dhis2/d2-i18n'
import StdDevOutlierAnalysis from './std-dev-outlier-analysis/StdDevOutlierAnalysis'
import MinMaxOutlierAnalysis from './min-max-outlier-analysis/MinMaxOutlierAnalysis'
import FollowUpAnalysis from './follow-up-analysis/FollowUpAnalysis'

export const VALIDATION_RULES_ANALYSIS_SECTION_KEY = 'validationRulesAnalysis'
export const STD_DEV_OUTLIER_ANALYSIS_SECTION_KEY = 'stdDevOutlierAnalysis'
export const MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY = 'minMaxOutlierAnalysis'
export const FOLLOW_UP_ANALYSIS_SECTION_KEY = 'followUpAnalysis'

export const sections = [
    {
        key: VALIDATION_RULES_ANALYSIS_SECTION_KEY,
        path: '/validation-rules-analysis',
        component: ValidationRulesAnalysis,
        info: {
            label: () => i18n.t('Validation Rule Analysis'),
            icon: 'done_all',
            description: () =>
                i18n.t(
                    'Run validation rules in order to unveil anomalies and errors in the data in the database.'
                ),
            actionText: () => i18n.t('Run Validation'),
            docs: 'validation_rule_analysis',
        },
    },
    {
        key: STD_DEV_OUTLIER_ANALYSIS_SECTION_KEY,
        path: '/std-dev-outlier-analysis',
        component: StdDevOutlierAnalysis,
        info: {
            label: () => i18n.t('Std Dev Outlier Analysis'),
            icon: 'show_chart',
            description: () =>
                i18n.t(
                    'Analyze potential outlier values based on standard deviations. Outlier values can be examined and marked for follow-up.'
                ),
            actionText: () => i18n.t('Analyze'),
            docs: 'standard_deviation_analysis',
        },
    },
    {
        key: MIN_MAX_OUTLIER_ANALYSIS_SECTION_KEY,
        path: '/min-max-outlier-analysis',
        component: MinMaxOutlierAnalysis,
        info: {
            label: () => i18n.t('Min-Max Outlier Analysis'),
            icon: 'compare_arrows',
            description: () =>
                i18n.t(
                    'Analyze potential outlier values based on min and max values. Outlier values can be examined and marked for follow-up.'
                ),
            actionText: () => i18n.t('Analyze'),
            docs: 'min_max_analysis',
        },
    },
    {
        key: FOLLOW_UP_ANALYSIS_SECTION_KEY,
        path: '/follow-up-analysis',
        component: FollowUpAnalysis,
        info: {
            label: () => i18n.t('Follow-Up Analysis'),
            icon: 'description',
            description: () =>
                i18n.t(
                    'View or edit data values marked for further follow-up during data entry or analysis.'
                ),
            actionText: () => i18n.t('View Data Values'),
            docs: 'follow_up_analysis',
        },
    },
]

export const getDocsKeyForSection = sectionKey => {
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i]
        if (section.key === sectionKey) {
            return section.info.docs
        }
    }

    return ''
}

export default sections
