import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './TableCellContent.module.css'

const TableCellContent = props => (
    <div
        className={cx(styles.tableCellContent, props.className, {
            [styles[`tableCellContent-${props.size}`]]: props.size,
        })}
    >
        {props.children}
    </div>
)

TableCellContent.propTypes = {
    size: PropTypes.oneOf(['narrow', 'medium', 'wide']),
}

export default TableCellContent
