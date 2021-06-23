import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import PropTypes from 'prop-types'
import React from 'react'
import AvailableDatasetsSelect from '../../../components/AvailableDatasetsSelect/AvailableDatasetsSelect'
import AvailableOrganisationUnitsTree from '../../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles'
import { Z_SCORE, MIN_MAX } from '../constants'
import ThresholdField from './ThresholdField'
import ZScoreFields from './ZScoreFields'

const Form = ({
    onSubmit,
    valid,
    loading,
    startDate,
    endDate,
    algorithm,
    showAdvancedZScoreFields,
    onToggleAdvancedZScoreFields,
    onAlgorithmChange,
    threshold,
    onThresholdChange,
    orderBy,
    onOrderByChange,
    dataStartDate,
    dataEndDate,
    onDataStartDateChange,
    onDataEndDateChange,
    dataSetIds,
    onDataSetsOnChange,
    onOrganisationUnitChange,
    maxResults,
    onMaxResultsChange,
    onStartDateChange,
    onEndDateChange,
}) => (
    <>
        <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-4">
                <h3 className={cssPageStyles.formLabel}>
                    {i18n.t('Data set')}
                </h3>
                <AvailableDatasetsSelect
                    selected={dataSetIds}
                    onChange={onDataSetsOnChange}
                />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4">
                <h3 className={cssPageStyles.formLabel}>
                    {i18n.t('Organisation units')}
                </h3>
                <AvailableOrganisationUnitsTree
                    multiselect
                    onChange={onOrganisationUnitChange}
                />
            </div>
            <div className="col-sm-12 col-md-6 col-lg-4">
                <DatePicker
                    textFieldStyle={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('Start date')}
                    onChange={onStartDateChange}
                    defaultDate={new Date()}
                    maxDate={endDate}
                    value={startDate}
                />
                <DatePicker
                    textFieldStyle={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('End date')}
                    onChange={onEndDateChange}
                    defaultDate={new Date()}
                    minDate={startDate}
                    value={endDate}
                />
                <SelectField
                    style={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('Algorithm')}
                    onChange={onAlgorithmChange}
                    value={algorithm}
                >
                    <MenuItem value={Z_SCORE} primaryText="Z-score" />
                    <MenuItem value={MIN_MAX} primaryText="Min-max values" />
                </SelectField>
                {algorithm === Z_SCORE && (
                    <ThresholdField
                        threshold={threshold}
                        onChange={onThresholdChange}
                    />
                )}
                <SelectField
                    style={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('Max results')}
                    onChange={onMaxResultsChange}
                    value={maxResults}
                >
                    <MenuItem value={100} primaryText="100" />
                    <MenuItem value={200} primaryText="200" />
                    <MenuItem value={500} primaryText="500" />
                </SelectField>
                {algorithm === Z_SCORE && (
                    <ZScoreFields
                        showAdvancedZScoreFields={showAdvancedZScoreFields}
                        onToggleAdvancedZScoreFields={
                            onToggleAdvancedZScoreFields
                        }
                        orderBy={orderBy}
                        onOrderByChange={onOrderByChange}
                        dataStartDate={dataStartDate}
                        dataEndDate={dataEndDate}
                        onDataStartDateChange={onDataStartDateChange}
                        onDataEndDateChange={onDataEndDateChange}
                    />
                )}
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
                i18n.t('Start')
            )}
        </Button>
    </>
)

Form.propTypes = {
    algorithm: PropTypes.string.isRequired,
    dataSetIds: PropTypes.array.isRequired,
    endDate: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    maxResults: PropTypes.number.isRequired,
    orderBy: PropTypes.string.isRequired,
    showAdvancedZScoreFields: PropTypes.bool.isRequired,
    startDate: PropTypes.object.isRequired,
    threshold: PropTypes.number.isRequired,
    valid: PropTypes.bool.isRequired,
    onAlgorithmChange: PropTypes.func.isRequired,
    onDataEndDateChange: PropTypes.func.isRequired,
    onDataSetsOnChange: PropTypes.func.isRequired,
    onDataStartDateChange: PropTypes.func.isRequired,
    onEndDateChange: PropTypes.func.isRequired,
    onMaxResultsChange: PropTypes.func.isRequired,
    onOrderByChange: PropTypes.func.isRequired,
    onOrganisationUnitChange: PropTypes.func.isRequired,
    onStartDateChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onThresholdChange: PropTypes.func.isRequired,
    onToggleAdvancedZScoreFields: PropTypes.func.isRequired,
    dataEndDate: PropTypes.object,
    dataStartDate: PropTypes.object,
}

export default Form
