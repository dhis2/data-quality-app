import {
    Checkbox,
    TableRow,
    TableRowColumn,
    FontIcon,
    IconButton,
} from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../../components/FormattedNumber/FormattedNumber.jsx'
import OrganisationUnitHierarchy from '../../../components/OrganisationUnitHierarchy/OrganisationUnitHierarchy.jsx'
import { formatHierarchy } from '../../../helpers/org-unit-hierarchy.js'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles.js'

const ElementRow = ({
    ancestors,
    element,
    onCheckboxToggle,
    onShowComment,
}) => (
    <TableRow>
        <TableRowColumn>{element.dataElement}</TableRowColumn>
        <TableRowColumn
            title={formatHierarchy(element.organisation, ancestors)}
        >
            <OrganisationUnitHierarchy
                name={element.organisation}
                ancestors={ancestors}
            />
        </TableRowColumn>
        <TableRowColumn>{element.period}</TableRowColumn>
        <TableRowColumn className={cssPageStyles.numericalRow}>
            {typeof element.min === 'number' && (
                <FormattedNumber value={element.min} />
            )}
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.numericalRow}>
            <FormattedNumber value={element.value} />
        </TableRowColumn>
        <TableRowColumn className={cssPageStyles.numericalRow}>
            {typeof element.max === 'number' && (
                <FormattedNumber value={element.max} />
            )}
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
    ancestors: PropTypes.arrayOf(PropTypes.string),
}

export default ElementRow
