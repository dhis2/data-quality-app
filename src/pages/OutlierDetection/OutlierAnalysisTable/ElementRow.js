import { Checkbox, TableRow, TableRowColumn } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../../components/FormattedNumber/FormattedNumber'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles'

const ElementRow = ({ element, isZScoreAlgorithm, onToggleCheckbox }) => (
    <TableRow>
        <TableRowColumn>
            <span title={element.displayName}>{element.displayName}</span>
        </TableRowColumn>
        <TableRowColumn>{element.pe}</TableRowColumn>
        <TableRowColumn>
            <span title={element.ouName}>{element.ouName}</span>
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.right}>
            <FormattedNumber value={element.value} minimumFractionDigits={0} />
        </TableRowColumn>
        {isZScoreAlgorithm && (
            <TableRowColumn className={cssPageStyles.right}>
                <FormattedNumber value={element.zScore} />
            </TableRowColumn>
        )}
        <TableRowColumn className={cssPageStyles.right}>
            <FormattedNumber value={element.absDev} minimumFractionDigits={0} />
        </TableRowColumn>
        {isZScoreAlgorithm && (
            <TableRowColumn className={cssPageStyles.right}>
                <FormattedNumber value={element.stdDev} />
            </TableRowColumn>
        )}
        {isZScoreAlgorithm && (
            <TableRowColumn className={cssPageStyles.right}>
                <FormattedNumber
                    value={element.mean}
                    minimumFractionDigits={0}
                />
            </TableRowColumn>
        )}
        <TableRowColumn className={cssPageStyles.right}>
            <FormattedNumber
                value={element.lowerBound}
                minimumFractionDigits={0}
            />
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.right}>
            <FormattedNumber
                value={element.upperBound}
                minimumFractionDigits={0}
            />
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.centerFlex}>
            <span className={cssPageStyles.checkboxWrapper}>
                <Checkbox
                    checked={element.marked}
                    onCheck={() => onToggleCheckbox(element)}
                    iconStyle={jsPageStyles.iconColor}
                />
            </span>
        </TableRowColumn>
    </TableRow>
)

ElementRow.propTypes = {
    element: PropTypes.object.isRequired,
    isZScoreAlgorithm: PropTypes.bool.isRequired,
    onToggleCheckbox: PropTypes.func.isRequired,
}

export default ElementRow
