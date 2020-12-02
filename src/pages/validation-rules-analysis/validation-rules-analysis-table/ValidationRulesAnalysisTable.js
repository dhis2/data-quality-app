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
import TableCellContent from '../../../components/table/TableCellContent'

class ValidationRulesAnalysisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    render() {
        const elements = this.props.elements

        const shouldDisplayAttributeOptionCombo = elements.some(
            e => e.attributeOptionCombo && e.attributeOptionCombo !== 'default'
        )

        // Table Rows
        const rows = elements.map(element => (
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
                            attributeOptionComboId={
                                element.attributeOptionComboId
                            }
                        />
                    </TableCellContent>
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
                    fixedHeader={false}
                    bodyStyle={{ overflowX: 'auto' }}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn
                                title={i18n.t('Organisation Unit')}
                            >
                                {i18n.t('Organisation Unit')}
                            </TableHeaderColumn>
                            {shouldDisplayAttributeOptionCombo && (
                                <TableHeaderColumn
                                    title={i18n.t(
                                        'Attribute Option Combination'
                                    )}
                                >
                                    {i18n.t('Attr. Opt. Combo')}
                                </TableHeaderColumn>
                            )}
                            <TableHeaderColumn title={i18n.t('Period')}>
                                {i18n.t('Period')}
                            </TableHeaderColumn>
                            <TableHeaderColumn title={i18n.t('Importance')}>
                                {i18n.t('Importance')}
                            </TableHeaderColumn>
                            <TableHeaderColumn
                                title={i18n.t('Validation Rule')}
                            >
                                {i18n.t('Validation Rule')}
                            </TableHeaderColumn>
                            <TableHeaderColumn title={i18n.t('Value')}>
                                {i18n.t('Value')}
                            </TableHeaderColumn>
                            <TableHeaderColumn title={i18n.t('Operator')}>
                                {i18n.t('Operator')}
                            </TableHeaderColumn>
                            <TableHeaderColumn title={i18n.t('Value')}>
                                {i18n.t('Value')}
                            </TableHeaderColumn>
                            <TableHeaderColumn title={i18n.t('Details')}>
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
