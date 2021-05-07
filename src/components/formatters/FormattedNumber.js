import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'

const FormattedNumber = ({
    value,
    minimumFractionDigits,
    maximumFractionDigits,
}) => (
    <span>
        {typeof value === 'number' &&
            new Intl.NumberFormat(i18n.language, {
                minimumFractionDigits,
                maximumFractionDigits,
            }).format(value)}
    </span>
)

FormattedNumber.defaultProps = {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
}

FormattedNumber.propTypes = {
    value: PropTypes.number.isRequired,
    maximumFractionDigits: PropTypes.number,
    minimumFractionDigits: PropTypes.number,
}

export default FormattedNumber
