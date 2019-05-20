import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';
import FormattedNumber from '../../../components/formatters/FormattedNumber';
import DownloadAs from '../../../components/download-as/DownloadAs';
import cssPageStyles from '../../Page.css';
import styles from './ValidationRulesAnalysisTable.css';
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';
import ValidationRulesDetails from '../validation-rules-details/ValidationRulesDetails';
import { apiConf } from '../../../server.conf';

class ValidationRulesAnalysisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    render() {
        const elements = this.props.elements;

        // Table Rows
        const rows = elements.map(element => (
            <TableRow key={element.key}>
                <TableRowColumn>{element.organisation}</TableRowColumn>
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
        ));

        return (
            <div>
                <div className={cssPageStyles.cardHeader}>
                    <DownloadAs endpoint={apiConf.endpoints.validationRulesReport} />
                </div>
                <Table
                    selectable={false}
                    className={classNames(cssPageStyles.appTable, styles.validationTable)}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.organisationUnit)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.period)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.importance)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.validationRule)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.operator)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.center}>
                                {i18n.t(i18nKeys.validationRulesAnalysis.tableHeaderColumn.details)}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={false}>
                        {rows}
                    </TableBody>
                </Table>
                <div className={classNames(cssPageStyles.cardFooter, cssPageStyles.end)}>
                    <DownloadAs endpoint={apiConf.endpoints.validationRulesReport} />
                </div>
            </div>
        );
    }
}

export default ValidationRulesAnalysisTable;
