import React from 'react'
import PropTypes from 'prop-types'
import styles from './TableCellContent.module.css'
import cx from 'classnames'

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
