import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, Checkbox } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import React from 'react'
import AvailableOrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles'
import ValidationRuleGroupsSelect from './ValidationRuleGroupsSelect'

/* eslint-disable react/prop-types */

const ValidateButton = ({ onClick, disabled }) => {
    const validationPassedAlert = useAlert(
        i18n.t('Validation passed successfully'),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) => {
            error?.message ||
                i18n.t('An unexpected error happened during analysis')
        },
        { critical: true }
    )
    const handleClick = async () => {
        try {
            const result = await onClick()
            if (result === 'VALIDATION_PASSED') {
                validationPassedAlert.show()
            }
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Button
            primary
            className={cssPageStyles.mainButton}
            disabled={disabled}
            onClick={handleClick}
        >
            {i18n.t('Validate')}
        </Button>
    )
}

const Form = ({
    onSubmit,
    submitDisabled,
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
}) => (
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
                <DatePicker
                    textFieldStyle={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('Start Date')}
                    onChange={onStartDateChange}
                    value={startDate}
                    defaultDate={new Date()}
                    maxDate={endDate}
                />
                <DatePicker
                    textFieldStyle={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('End Date')}
                    onChange={onEndDateChange}
                    value={endDate}
                    defaultDate={new Date()}
                    minDate={startDate}
                />
                <div>
                    <ValidationRuleGroupsSelect
                        style={jsPageStyles.inputForm}
                        onChange={onValidationRuleGroupChange}
                    />
                </div>
                <div>
                    <Checkbox
                        label={i18n.t('Send Notifications')}
                        checked={sendNotfications}
                        onChange={onSendNotificationsChange}
                    />
                </div>
                <div>
                    <Checkbox
                        label={i18n.t('Persist new results')}
                        checked={persistNewResults}
                        onChange={onPersistNewResultsChange}
                    />
                </div>
            </div>
        </div>
        <ValidateButton onClick={onSubmit} disabled={submitDisabled} />
    </>
)

export default Form
