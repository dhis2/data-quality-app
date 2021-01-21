import React from 'react'
import PropTypes from 'prop-types'

const FormattedNumber = ({
    value,
    minimumFractionDigits,
    maximumFractionDigits,
}) => (
    <span>
        {new Intl.NumberFormat(sessionStorage.getItem('uiLocale'), {
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(value)}
    </span>
)

FormattedNumber.defaultProps = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
}

FormattedNumber.propTypes = {
    value: PropTypes.number.isRequired,
    minimumFractionDigits: PropTypes.number,
    maximumFractionDigits: PropTypes.number,
}

export default FormattedNumber
