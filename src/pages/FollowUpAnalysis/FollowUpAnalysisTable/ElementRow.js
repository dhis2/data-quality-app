import {
    Checkbox,
    TableRow,
    TableRowColumn,
    FontIcon,
    IconButton,
} from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../../components/FormattedNumber/FormattedNumber'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles'

const ElementRow = ({ element, onCheckboxToggle, onShowComment }) => (
    <TableRow>
        <TableRowColumn>{element.dataElement}</TableRowColumn>
        <TableRowColumn>{element.organisation}</TableRowColumn>
        <TableRowColumn>{element.period}</TableRowColumn>
        <TableRowColumn className={cssPageStyles.numericalRow}>
            <FormattedNumber value={element.min} />
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.numericalRow}>
            <FormattedNumber value={element.value} />
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.numericalRow}>
            <FormattedNumber value={element.max} />
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.centerFlex}>
            <span className={cssPageStyles.checkboxWrapper}>
                <Checkbox
                    checked={element.marked}
                    onCheck={onCheckboxToggle}
                    iconStyle={jsPageStyles.iconColor}
                />
            </span>
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.center}>
            {element.comment && (
                <IconButton onClick={onShowComment}>
                    <FontIcon
                        className={'material-icons'}
                        style={jsPageStyles.cursorStyle}
                    >
                        speaker_notes
                    </FontIcon>
                </IconButton>
            )}
        </TableRowColumn>
    </TableRow>
)

ElementRow.propTypes = {
    element: PropTypes.object.isRequired,
    onCheckboxToggle: PropTypes.func.isRequired,
    onShowComment: PropTypes.func.isRequired,
}

export default ElementRow
