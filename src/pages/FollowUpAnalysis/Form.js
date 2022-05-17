import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import PropTypes from 'prop-types'
import React from 'react'
import AvailableDataSetsSelect from '../../components/AvailableDataSetsSelect/AvailableDataSetsSelect.js'
import AvailableOrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree.js'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles.js'

const Form = ({
    onSubmit,
    valid,
    loading,
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
                <AvailableDataSetsSelect
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
        <Button
            primary
            className={cssPageStyles.mainButton}
            disabled={!valid || loading}
            onClick={onSubmit}
        >
            {loading ? (
                <>
                    {i18n.t('Processing...')}
                    <CircularLoader small />
                </>
            ) : (
                i18n.t('Follow up')
            )}
        </Button>
    </>
)

Form.propTypes = {
    dataSetIds: PropTypes.array.isRequired,
    endDate: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    startDate: PropTypes.object.isRequired,
    valid: PropTypes.bool.isRequired,
    onDataSetsChange: PropTypes.func.isRequired,
    onEndDateChange: PropTypes.func.isRequired,
    onOrganisationUnitChange: PropTypes.func.isRequired,
    onStartDateChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

export default Form
