import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui';

import FormattedNumber from '../../../components/formatters/FormattedNumber';
import DownloadAs from '../../../components/download-as/DownloadAs';

// styles
import cssPageStyles from '../../Page.css';
import jsPageStyles from '../../PageStyles';
import { i18nKeys } from '../../../i18n';
import ValidationRulesDetails from '../validation-rules-details/ValidationRulesDetails';

class ValidationRulesAnalysisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
        d2: PropTypes.object,
    }

    constructor() {
        super();
        this.state = {
            openDetails: false,
        };
    }

    render() {
        const translator = this.context.translator;
        const elements = this.props.elements;

        // Table Rows
        const rows = elements.map(element => (
            <TableRow key={element.label}>
                <TableRowColumn>{element.organisation}</TableRowColumn>
                <TableRowColumn>{element.period}</TableRowColumn>
                <TableRowColumn>{element.importance}</TableRowColumn>
                <TableRowColumn>{element.validationRule}</TableRowColumn>
                <TableRowColumn className={jsPageStyles.number}>
                    <FormattedNumber value={element.valueOne} />
                </TableRowColumn>
                <TableRowColumn>{element.operator}</TableRowColumn>
                <TableRowColumn className={jsPageStyles.number}>
                    <FormattedNumber value={element.valueTwo} />
                </TableRowColumn>
                <TableRowColumn>
                    <ValidationRulesDetails details={element.details} />
                </TableRowColumn>
            </TableRow>
        ));

        return (
            <div>
                <div className={cssPageStyles.cardHeader}>
                    <DownloadAs />
                </div>
                <Table
                    selectable={false}
                    className={cssPageStyles.appTable}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.organisationUnit)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.period)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.importance)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.validationRule)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.operator)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.validationRulesAnalysis.tableHeaderColumn.details)}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={false}>
                        {rows}
                    </TableBody>
                </Table>
                <div className={classNames(cssPageStyles.cardFooter, cssPageStyles.end)}>
                    <DownloadAs />
                </div>
            </div>
        );
    }
}

export default ValidationRulesAnalysisTable;
