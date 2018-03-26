import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui';

import FormattedNumber from '../../components/formatters/FormattedNumber';
import DownloadAs from '../../components/download-as/DownloadAs';

// helpers
import { apiConf } from '../../server.conf';

// styles
import cssPageStyles from '../../pages/Page.css';
import jsPageStyles from '../../pages/PageStyles';
import { i18nKeys } from '../../i18n';

const OutlierAnalyisTable = (props, context) => {
    const translator = context.translator;
    const elements = props.elements;
    const parentToggleCheckbox = props.toggleCheckbox;

    // Table Rows
    const rows = elements.map((element) => {
        const updateCheckbox = (() => {
            parentToggleCheckbox(element);
        });

        return (
            <TableRow key={element.key}>
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
                        checked={element.marked}
                        onCheck={updateCheckbox}
                        iconStyle={jsPageStyles.iconColor}

                    />
                </TableRowColumn>
            </TableRow>
        );
    });

    return (
        <div>
            <div className={cssPageStyles.cardHeader}>
                <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
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
                <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
            </div>
        </div>
    );
};

const generateElementKey = e =>
    `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`;

OutlierAnalyisTable.convertElementFromApiResponse = e => ({
    key: generateElementKey(e),
    attributeOptionComboId: e.attributeOptionComboId,
    categoryOptionComboId: e.categoryOptionComboId,
    periodId: e.periodId,
    sourceId: e.sourceId,
    dataElementId: e.dataElementId,
    dataElement: e.dataElementName,
    organisation: e.sourceName,
    period: e.period.name,
    min: e.min,
    max: e.max,
    value: Number.parseInt(e.value, 10),
    marked: e.followup,
});

OutlierAnalyisTable.propTypes = {
    elements: PropTypes.array.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
};

OutlierAnalyisTable.contextTypes = {
    translator: PropTypes.func,
    d2: PropTypes.object,
};

export default OutlierAnalyisTable;
