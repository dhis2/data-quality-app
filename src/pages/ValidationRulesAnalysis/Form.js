import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Checkbox, CircularLoader, CalendarInput } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import AvailableOrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree.js'
import cssPageStyles from '../Page.module.css'
import styles from './Form.module.css'
import ValidationRuleGroupsSelect from './ValidationRuleGroupsSelect.js'

const Form = ({
    onSubmit,
    valid,
    loading,
    onOrganisationUnitChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
    onValidationRuleGroupChange,
    sendNotfications,
    onSendNotificationsChange,
    persistNewResults,
    onPersistNewResultsChange,
}) => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    return (
        <>
            <div className="row">
                <div className="col-sm-12 col-md-6">
                    <div className={cssPageStyles.formLabel}>
                        {i18n.t('Parent organisation unit')}
                    </div>
                    <AvailableOrganisationUnitsTree
                        onChange={onOrganisationUnitChange}
                    />
                </div>
                <div className="col-sm-12 col-md-6">
                    <div className={styles.datepickers}>
                        <CalendarInput
                            onDateSelect={onStartDateChange}
                            date={startDate}
                            calendar={calendar}
                            locale="en"
                            label={i18n.t('Start Date')}
                        />
                    </div>
                    <div className={styles.datepickers}>
                        <CalendarInput
                            onDateSelect={onEndDateChange}
                            date={endDate}
                            calendar={calendar}
                            locale="en"
                            label={i18n.t('End Date')}
                        />
                    </div>
                    <div>
                        <ValidationRuleGroupsSelect
                            onChange={onValidationRuleGroupChange}
                        />
                    </div>
                    <div className={styles.checkboxes}>
                        <Checkbox
                            label={i18n.t('Send Notifications')}
                            checked={sendNotfications}
                            onChange={onSendNotificationsChange}
                        />
                        <Checkbox
                            label={i18n.t('Persist new results')}
                            checked={persistNewResults}
                            onChange={onPersistNewResultsChange}
                        />
                    </div>
                </div>
            </div>
            <Button
                primary
                className={cssPageStyles.mainButton}
                disabled={!valid || loading}
                onClick={onSubmit}
            >
                {loading ? (
                    <>
                        {i18n.t('Validating...')}
                        <CircularLoader small />
                    </>
                ) : (
                    i18n.t('Validate')
                )}
            </Button>
        </>
    )
}

Form.propTypes = {
    endDate: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    persistNewResults: PropTypes.bool.isRequired,
    sendNotfications: PropTypes.bool.isRequired,
    startDate: PropTypes.object.isRequired,
    valid: PropTypes.bool.isRequired,
    onEndDateChange: PropTypes.func.isRequired,
    onOrganisationUnitChange: PropTypes.func.isRequired,
    onPersistNewResultsChange: PropTypes.func.isRequired,
    onSendNotificationsChange: PropTypes.func.isRequired,
    onStartDateChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onValidationRuleGroupChange: PropTypes.func.isRequired,
}

export default Form
