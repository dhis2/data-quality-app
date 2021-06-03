import i18n from '@dhis2/d2-i18n'
import { Button, Checkbox, CircularLoader } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import React from 'react'
import AvailableOrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles'
import ValidationRuleGroupsSelect from './ValidationRuleGroupsSelect'

/* eslint-disable react/prop-types */

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

export default Form
