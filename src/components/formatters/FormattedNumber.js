import React from 'react';
import PropTypes from 'prop-types';

const FormattedNumber = props =>
    (
        <span>
            {
                new Intl.NumberFormat(
                    sessionStorage.getItem('uiLocale'),
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                ).format(props.value)
            }
        </span>
    );

FormattedNumber.propTypes = {
    value: PropTypes.number.isRequired,
};

export default FormattedNumber;
