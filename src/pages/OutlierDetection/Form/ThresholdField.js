import i18n from '@dhis2/d2-i18n'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'
import PropTypes from 'prop-types'
import React from 'react'
import jsPageStyles from '../../PageStyles'

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

ThresholdField.propTypes = {
    threshold: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default ThresholdField
