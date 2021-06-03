import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import React from 'react'
import AvailableDatasetsSelect from '../../components/AvailableDatasetsSelect/AvailableDatasetsSelect'
import AvailableOrganisationUnitsTree from '../../components/AvailableOrganisationUnitsTree/AvailableOrganisationUnitsTree'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles'
import { Z_SCORE } from './constants'
import styles from './Form.module.css'

/* eslint-disable react/prop-types */

const StartButton = ({ onClick, disabled }) => {
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
            {i18n.t('Start')}
        </Button>
    )
}

const ThresholdField = ({ threshold, onChange }) => (
    <SelectField
        style={jsPageStyles.inputForm}
        floatingLabelText={i18n.t('Threshold')}
        onChange={onChange}
        value={threshold}
    >
        <MenuItem value={1} primaryText="1.0" />
        <MenuItem value={1.5} primaryText="1.5" />
        <MenuItem value={2} primaryText="2.0" />
        <MenuItem value={2.5} primaryText="2.5" />
        <MenuItem value={3} primaryText="3.0" />
        <MenuItem value={3.5} primaryText="3.5" />
        <MenuItem value={4} primaryText="4.0" />
        <MenuItem value={4.5} primaryText="4.5" />
        <MenuItem value={5} primaryText="5.0" />
    </SelectField>
)

const ZScoreFields = ({
    showAdvancedZScoreFields,
    onToggleAdvancedZScoreFields,
    orderBy,
    onOrderByChange,
    dataStartDate,
    dataEndDate,
    onDataStartDateChange,
    onDataEndDateChange,
}) => (
    <>
        <Button
            small
            secondary
            className={styles.toggleBtn}
            onClick={onToggleAdvancedZScoreFields}
        >
            {showAdvancedZScoreFields
                ? i18n.t('Hide advanced options')
                : i18n.t('Show advanced options')}
        </Button>
        {showAdvancedZScoreFields && (
            <>
                <div className={styles.optionalDatepickerContainer}>
                    <DatePicker
                        textFieldStyle={jsPageStyles.inputForm}
                        floatingLabelText={i18n.t('Data start date')}
                        onChange={(event, date) => onDataStartDateChange(date)}
                        maxDate={dataEndDate}
                        value={dataStartDate}
                    />
                    <Button
                        secondary
                        small
                        disabled={!dataStartDate}
                        onClick={() => onDataStartDateChange(null)}
                    >
                        {i18n.t('Clear')}
                    </Button>
                </div>
                <div className={styles.optionalDatepickerContainer}>
                    <DatePicker
                        textFieldStyle={jsPageStyles.inputForm}
                        floatingLabelText={i18n.t('Data end date')}
                        onChange={(event, date) => onDataEndDateChange(date)}
                        minDate={dataStartDate}
                        value={dataEndDate}
                    />
                    <Button
                        secondary
                        small
                        disabled={!dataEndDate}
                        onClick={() => onDataEndDateChange(null)}
                    >
                        {i18n.t('Clear')}
                    </Button>
                </div>
                <SelectField
                    style={jsPageStyles.inputForm}
                    floatingLabelText={i18n.t('Sort by')}
                    onChange={onOrderByChange}
                    value={orderBy}
                >
                    <MenuItem value={Z_SCORE} primaryText="Z-score" />
                    <MenuItem
                        value="MEAN_ABS_DEV"
                        primaryText="Absolute Deviation from Mean"
                    />
                </SelectField>
            </>
        )}
    </>
)

const Form = ({
    onSubmit,
    submitDisabled,
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
                    <MenuItem value="MIN_MAX" primaryText="Min-max values" />
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
        <StartButton onClick={onSubmit} disabled={submitDisabled} />
    </>
)

export default Form
