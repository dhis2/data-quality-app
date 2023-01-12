import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader, CalendarInput } from '@dhis2/ui'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import PropTypes from 'prop-types'
import React from 'react'
import AvailableDataSetsSelect from '../../../components/AvailableDataSetsSelect/AvailableDataSetsSelect.js'
import AvailableOrganisationUnitsTree from '../../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree.js'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles.js'
import { Z_SCORE_ALGORITHMS, ALGORITHM_TO_LABEL_MAP } from '../constants.js'
import ThresholdField from './ThresholdField.js'
import ZScoreFields from './ZScoreFields.js'

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
}) => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    return (
        <>
            <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-4">
                    <h3 className={cssPageStyles.formLabel}>
                        {i18n.t('Data set')}
                    </h3>
                    <AvailableDataSetsSelect
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
                    <div className={cssPageStyles.datepickers}>
                        <CalendarInput
                            onDateSelect={onStartDateChange}
                            date={startDate}
                            calendar={calendar}
                            locale="en"
                            label={i18n.t('Start Date')}
                        />
                    </div>
                    <div className={cssPageStyles.datepickers}>
                        <CalendarInput
                            onDateSelect={onEndDateChange}
                            date={endDate}
                            calendar={calendar}
                            locale="en"
                            label={i18n.t('End Date')}
                        />
                    </div>
                    <SelectField
                        style={jsPageStyles.inputForm}
                        floatingLabelText={i18n.t('Algorithm')}
                        onChange={onAlgorithmChange}
                        value={algorithm}
                    >
                        {Object.keys(ALGORITHM_TO_LABEL_MAP).map((algo) => (
                            <MenuItem
                                key={algo}
                                value={algo}
                                primaryText={i18n.t(
                                    ALGORITHM_TO_LABEL_MAP[algo]
                                )}
                            />
                        ))}
                    </SelectField>
                    {Z_SCORE_ALGORITHMS.has(algorithm) && (
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
                    {Z_SCORE_ALGORITHMS.has(algorithm) && (
                        <ZScoreFields
                            algorithm={algorithm}
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
}

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
