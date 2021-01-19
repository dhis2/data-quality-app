import ValidationRulesAnalysis from './validation-rules-analysis/ValidationRulesAnalysis'
import OutlierDetection from './outlier-detection/OutlierDetection'
import FollowUpAnalysis from './follow-up-analysis/FollowUpAnalysis'

export const VALIDATION_RULES_ANALYSIS_SECTION_KEY = 'validationRulesAnalysis'
export const OUTLIER_DETECTION_SECTION_KEY = 'outlierDetection'
export const FOLLOW_UP_ANALYSIS_SECTION_KEY = 'followUpAnalysis'

export const sections = [
    {
        key: VALIDATION_RULES_ANALYSIS_SECTION_KEY,
        path: '/validation-rules-analysis',
        component: ValidationRulesAnalysis,
        info: {
            label: 'Validation Rule Analysis',
            icon: 'done_all',
            description:
                'Run validation rules in order to unveil anomalies and errors in the data in the database.',
            actionText: 'Run Validation',
            docs: 'validation_rule_analysis',
        },
    },
    {
        key: OUTLIER_DETECTION_SECTION_KEY,
        path: '/outlier-detection',
        component: OutlierDetection,
        info: {
            label: 'Std Dev Outlier Analysis',
            icon: 'show_chart',
            description:
                'Analyze potential outlier values based on standard deviations. Outlier values can be examined and marked for follow-up.',
            actionText: 'Analyze',
            docs: 'standard_deviation_analysis',
        },
    },
    {
        key: FOLLOW_UP_ANALYSIS_SECTION_KEY,
        path: '/follow-up-analysis',
        component: FollowUpAnalysis,
        info: {
            label: 'Follow-Up Analysis',
            icon: 'description',
            description:
                'View or edit data values marked for further follow-up during data entry or analysis.',
            actionText: 'View Data Values',
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
