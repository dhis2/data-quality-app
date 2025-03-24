import { TableRow, TableRowColumn } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../../components/FormattedNumber/FormattedNumber.jsx'
import ValidationRulesDetails from '../ValidationRulesDetails/ValidationRulesDetails.jsx'
import styles from './ElementRow.module.css'
import TableCellContent from './TableCellContent.jsx'

const ElementRow = ({ element, shouldDisplayAttributeOptionCombo }) => (
    <TableRow key={element.key}>
        <TableRowColumn title={element.organisation}>
            <TableCellContent>{element.organisation}</TableCellContent>
        </TableRowColumn>
        {shouldDisplayAttributeOptionCombo && (
            <TableRowColumn title={element.attributeOptionCombo}>
                <TableCellContent size="wide">
                    {element.attributeOptionCombo}
                </TableCellContent>
            </TableRowColumn>
        )}
        <TableRowColumn title={element.period}>
            <TableCellContent>{element.period}</TableCellContent>
        </TableRowColumn>
        <TableRowColumn title={element.importance}>
            <TableCellContent>{element.importance}</TableCellContent>
        </TableRowColumn>
        <TableRowColumn title={element.validationRule}>
            <TableCellContent size={'medium'}>
                {element.validationRule}
            </TableCellContent>
        </TableRowColumn>
        <TableRowColumn title={element.leftValue}>
            <TableCellContent>
                <FormattedNumber value={element.leftValue} />
            </TableCellContent>
        </TableRowColumn>
        <TableRowColumn title={element.operator}>
            <TableCellContent className={styles.operator}>
                {element.operator}
            </TableCellContent>
        </TableRowColumn>
        <TableRowColumn title={element.rightValue}>
            <TableCellContent>
                <FormattedNumber value={element.rightValue} />
            </TableCellContent>
        </TableRowColumn>
        <TableRowColumn>
            <TableCellContent>
                <ValidationRulesDetails
                    validationRuleId={element.validationRuleId}
                    periodId={element.periodId}
                    organisationUnitId={element.organisationUnitId}
                    attributeOptionComboId={element.attributeOptionComboId}
                />
            </TableCellContent>
        </TableRowColumn>
    </TableRow>
)

ElementRow.propTypes = {
    element: PropTypes.object.isRequired,
    shouldDisplayAttributeOptionCombo: PropTypes.bool.isRequired,
}

export default ElementRow
