import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui'
import FormattedNumber from '../../../components/formatters/FormattedNumber'
import DownloadAs from '../../../components/download-as/DownloadAs'
import cssPageStyles from '../../Page.module.css'
import styles from './ValidationRulesAnalysisTable.module.css'
import i18n from '../../../locales'
import ValidationRulesDetails from '../validation-rules-details/ValidationRulesDetails'
import { apiConf } from '../../../server.conf'

class ValidationRulesAnalysisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    render() {
        const elements = this.props.elements

        const shouldDisplayAttributeOptionCombo = elements.some(
            e => e.attributeOptionCombo !== 'default'
        )

        // Table Rows
        const rows = elements.map(element => (
            <TableRow key={element.key}>
                <TableRowColumn>{element.organisation}</TableRowColumn>
                {shouldDisplayAttributeOptionCombo && (
                    <TableRowColumn>
                        {element.attributeOptionCombo}
                    </TableRowColumn>
                )}
                <TableRowColumn>{element.period}</TableRowColumn>
                <TableRowColumn>{element.importance}</TableRowColumn>
                <TableRowColumn>{element.validationRule}</TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.leftValue} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <span className={styles.operator}>{element.operator}</span>
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.rightValue} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.center}>
                    <ValidationRulesDetails
                        validationRuleId={element.validationRuleId}
                        periodId={element.periodId}
                        organisationUnitId={element.organisationUnitId}
                    />
                </TableRowColumn>
            </TableRow>
        ))

        return (
            <div>
                <div className={cssPageStyles.cardHeader}>
                    <DownloadAs
                        endpoint={apiConf.endpoints.validationRulesReport}
                    />
                </div>
                <Table
                    selectable={false}
                    className={classNames(
                        cssPageStyles.appTable,
                        styles.validationTable
                    )}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>
                                {i18n.t('Organisation Unit')}
                            </TableHeaderColumn>
                            {shouldDisplayAttributeOptionCombo && (
                                <TableHeaderColumn>
                                    {i18n.t('Attr. Opt. Combo')}
                                </TableHeaderColumn>
                            )}
                            <TableHeaderColumn>
                                {i18n.t('Period')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t('Importance')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t('Validation Rule')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Value')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Operator')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Value')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.center}>
                                {i18n.t('Details')}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={false}>
                        {rows}
                    </TableBody>
                </Table>
                <div
                    className={classNames(
                        cssPageStyles.cardFooter,
                        cssPageStyles.end
                    )}
                >
                    <DownloadAs
                        endpoint={apiConf.endpoints.validationRulesReport}
                    />
                </div>
            </div>
        )
    }
}

export default ValidationRulesAnalysisTable
