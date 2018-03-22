import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui';

import FormattedNumber from '../../components/formatters/FormattedNumber';
import DownloadAs from '../../components/download-as/DownloadAs';

// styles
import cssPageStyles from '../../pages/Page.css';
import jsPageStyles from '../../pages/PageStyles';
import { i18nKeys } from '../../i18n';

class OutlierAnalyisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
        d2: PropTypes.object,
    }

    render() {
        const translator = this.context.translator;
        const elements = this.props.elements;
        const toggleCheckbox = (() => {
        });

        // Table Rows
        const rows = elements.map(element => (
            <TableRow key={element.label}>
                <TableRowColumn>{element.dataElement}</TableRowColumn>
                <TableRowColumn>{element.organisation}</TableRowColumn>
                <TableRowColumn>{element.period}</TableRowColumn>
                <TableRowColumn className={jsPageStyles.number}>
                    <FormattedNumber value={element.min} />
                </TableRowColumn>
                <TableRowColumn className={jsPageStyles.number}>
                    <FormattedNumber value={element.value} />
                </TableRowColumn>
                <TableRowColumn className={jsPageStyles.number}>
                    <FormattedNumber value={element.max} />
                </TableRowColumn>
                <TableRowColumn>
                    <Checkbox
                        onCheck={toggleCheckbox}
                        iconStyle={jsPageStyles.iconColor}
                    />
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
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.dataElement)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.organisationUnit)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.period)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.min)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.max)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.outlierAnalysisTable.tableHeaderColumn.mark)}
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

export default OutlierAnalyisTable;
