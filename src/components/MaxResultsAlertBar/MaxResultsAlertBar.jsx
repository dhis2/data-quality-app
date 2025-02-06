import i18n from '@dhis2/d2-i18n'
import { Paper } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './MaxResultsAlertBar.module.css'

const MaxResultsAlertBar = ({ show }) => {
    if (!show) {
        return null
    }
    return (
        <Paper>
            <div className={styles.alertBar}>
                {i18n.t(
                    'More than 500 values found, please narrow the search to see all'
                )}
            </div>
        </Paper>
    )
}

MaxResultsAlertBar.propTypes = {
    show: PropTypes.bool.isRequired,
}

export default MaxResultsAlertBar
