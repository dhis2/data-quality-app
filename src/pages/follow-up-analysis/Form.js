import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import React from 'react'
import AvailableDatasetsSelect from '../../components/AvailableDatasetsSelect/AvailableDatasetsSelect'
import AvailableOrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles'

/* eslint-disable react/prop-types */

const FollowUpButton = ({ onClick, disabled }) => {
    const noValuesFoundAlert = useAlert(i18n.t('No values found'), {
        success: true,
    })
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
            if (result === 'NO_VALUES_FOUND') {
                noValuesFoundAlert.show()
            }
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    return (
        <Button
            primary
            className={cssPageStyles.mainButton}
            onClick={handleClick}
            disabled={disabled}
        >
            {i18n.t('Follow up')}
        </Button>
    )
}

const Form = ({
    onSubmit,
    submitDisabled,
    dataSetIds,
    onDataSetsChange,
    onOrganisationUnitChange,
    startDate,
    onStartDateChange,
    endDate,
    onEndDateChange,
}) => (
    <>
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4">
                <h3 className={cssPageStyles.formLabel}>
                    {i18n.t('Data Set')}
                </h3>
                <AvailableDatasetsSelect
                    selected={dataSetIds}
                    onChange={onDataSetsChange}
                />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4">
                <h3 className={cssPageStyles.formLabel}>
                    {i18n.t('Parent organisation unit')}
                </h3>
                <AvailableOrganisationUnitsTree
                    onChange={onOrganisationUnitChange}
                />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4">
                <DatePicker
                    id="start-date"
                    textFieldStyle={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('Start Date')}
                    onChange={onStartDateChange}
                    defaultDate={new Date()}
                    maxDate={endDate}
                    value={startDate}
                />
                <DatePicker
                    id="end-date"
                    textFieldStyle={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('End Date')}
                    onChange={onEndDateChange}
                    defaultDate={new Date()}
                    minDate={startDate}
                    value={endDate}
                />
            </div>
        </div>
        <FollowUpButton onClick={onSubmit} disabled={submitDisabled} />
    </>
)

export default Form
