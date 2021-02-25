import PropTypes from 'prop-types'
import React from 'react'

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
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
}

FormattedNumber.propTypes = {
    value: PropTypes.number.isRequired,
    maximumFractionDigits: PropTypes.number,
    minimumFractionDigits: PropTypes.number,
}

export default FormattedNumber
