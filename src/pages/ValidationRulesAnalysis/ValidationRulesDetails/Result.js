import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './ValidationRulesDetails.module.css'

const Result = ({ rule }) => (
    <div className={classNames('row', 'results-row', styles.sectionBox)}>
        <div className={classNames('col-xs-12', styles.sectionTitle)}>
            {i18n.t('VALIDATIONS RESULT DETAILS')}
        </div>
        <div className={classNames('col-xs-12', styles.sectionSubTitle)}>
            {i18n.t('VALIDATION RULE')}
        </div>
        <div className="col-xs-3">{i18n.t('Name')}</div>
        <div className="col-xs-9">{rule.displayName}</div>
        <div className="col-xs-3">{i18n.t('Description')}</div>
        <div className="col-xs-9">{rule.displayDescription}</div>
    </div>
)

Result.propTypes = {
    rule: PropTypes.object.isRequired,
}

export default Result
