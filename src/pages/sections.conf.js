import i18n from '@dhis2/d2-i18n'
import FollowUpAnalysis from './follow-up-analysis/FollowUpAnalysis'
import OutlierDetection from './outlier-detection/OutlierDetection'
import ValidationRulesAnalysis from './validation-rules-analysis/ValidationRulesAnalysis'

export const sections = [
    {
        key: 'validationRulesAnalysis',
        path: '/validation-rules-analysis',
        component: ValidationRulesAnalysis,
        info: {
            label: i18n.t('Validation Rule Analysis'),
            icon: 'done_all',
            description: i18n.t(
                'Run validation rules in order to unveil anomalies and errors in the data in the database.'
            ),
            actionText: i18n.t('Run Validation'),
            docs: 'validation_rule_analysis',
        },
    },
    {
        key: 'outlierDetection',
        path: '/outlier-detection',
        component: OutlierDetection,
        info: {
            label: i18n.t('Outlier detection'),
            icon: 'show_chart',
            description: i18n.t(
                'Analyze potential outlier values based on standard deviations or min-max values. Outlier values can be examined and marked for follow-up.'
            ),
            actionText: i18n.t('Analyze'),
            docs: 'outlier_detection',
        },
    },
    {
        key: 'followUpAnalysis',
        path: '/follow-up-analysis',
        component: FollowUpAnalysis,
        info: {
            label: i18n.t('Follow-Up Analysis'),
            icon: 'description',
            description: i18n.t(
                'View or edit data values marked for further follow-up during data entry or analysis.'
            ),
            actionText: i18n.t('View Data Values'),
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
