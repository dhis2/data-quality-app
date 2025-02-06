import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './TableCellContent.module.css'

const TableCellContent = ({ className, size, children }) => (
    <div
        className={cx(styles.tableCellContent, className, {
            [styles[`tableCellContent-${size}`]]: size,
        })}
    >
        {children}
    </div>
)

TableCellContent.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    size: PropTypes.oneOf(['narrow', 'medium', 'wide']),
}

export default TableCellContent
