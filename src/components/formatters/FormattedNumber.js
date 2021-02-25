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
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}

FormattedNumber.propTypes = {
    value: PropTypes.number.isRequired,
    minimumFractionDigits: PropTypes.number,
    maximumFractionDigits: PropTypes.number,
}

export default FormattedNumber
