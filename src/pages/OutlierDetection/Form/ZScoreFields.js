import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import PropTypes from 'prop-types'
import React from 'react'
import jsPageStyles from '../../PageStyles'
import { Z_SCORE, MEAN_ABS_DEV, ALGORITHM_TO_LABEL_MAP } from '../constants'
import styles from './ZScoreFields.module.css'

const ZScoreFields = ({
    algorithm,
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
                    <MenuItem
                        /* API uses Z-Score for both modified and regular Z-score
                        But show the algorithm selected to user */
                        value={Z_SCORE}
                        primaryText={ALGORITHM_TO_LABEL_MAP[algorithm]}
                    />
                    <MenuItem
                        value={MEAN_ABS_DEV}
                        primaryText={
                            algorithm === Z_SCORE
                                ? i18n.t('Absolute Deviation from Mean')
                                : i18n.t('Absolute Deviation from Median')
                        }
                    />
                </SelectField>
            </>
        )}
    </>
)

ZScoreFields.propTypes = {
    orderBy: PropTypes.string.isRequired,
    showAdvancedZScoreFields: PropTypes.bool.isRequired,
    onDataEndDateChange: PropTypes.func.isRequired,
    onDataStartDateChange: PropTypes.func.isRequired,
    onOrderByChange: PropTypes.func.isRequired,
    onToggleAdvancedZScoreFields: PropTypes.func.isRequired,
    algorithm: PropTypes.string,
    dataEndDate: PropTypes.object,
    dataStartDate: PropTypes.object,
}

export default ZScoreFields
