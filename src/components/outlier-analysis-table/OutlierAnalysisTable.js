import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Checkbox, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
} from 'material-ui';

import FormattedNumber from '../../components/formatters/FormattedNumber';
import DownloadAs from '../../components/download-as/DownloadAs';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

// helpers
import { apiConf } from '../../server.conf';

// styles
import cssPageStyles from '../../pages/Page.css';
import jsPageStyles from '../../pages/PageStyles';
import styles from './OutlierAnalysisTable.css';

const OutlierAnalyisTable = (props) => {
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
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.min} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.value} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.max} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.centerFlex}>
                    <span className={cssPageStyles.checkboxWrapper}>
                        <Checkbox
                            checked={element.marked}
                            onCheck={updateCheckbox}
                            iconStyle={jsPageStyles.iconColor}
                        />
                    </span>
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
                className={classNames(cssPageStyles.appTable, styles.outlierAnalysisTable)}
            >
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                    enableSelectAll={false}
                >
                    <TableRow>
                        <TableHeaderColumn>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.dataElement)}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.organisationUnit)}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.period)}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.min)}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.value)}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.max)}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.center}>
                            {i18n.t(i18nKeys.outlierAnalysisTable.tableHeaderColumn.mark)}
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

OutlierAnalyisTable.generateElementKey = e =>
    `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`;

OutlierAnalyisTable.convertElementFromApiResponse = e => ({
    key: OutlierAnalyisTable.generateElementKey(e),
    attributeOptionComboId: e.attributeOptionComboId,
    categoryOptionComboId: e.categoryOptionComboId,
    periodId: e.periodId,
    organisationUnitId: e.sourceId,
    dataElementId: e.dataElementId,
    dataElement: e.dataElementName,
    organisation: e.sourceName,
    period: e.period.name,
    min: e.min,
    max: e.max,
    value: Number.parseFloat(e.value),
    marked: e.followup,
});

OutlierAnalyisTable.convertElementToToggleFollowupRequest = e => ({
    dataElementId: e.dataElementId,
    periodId: e.periodId,
    organisationUnitId: e.organisationUnitId,
    categoryOptionComboId: e.categoryOptionComboId,
    attributeOptionComboId: e.attributeOptionComboId,
    followup: !e.marked,
});

OutlierAnalyisTable.propTypes = {
    elements: PropTypes.array.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
};

OutlierAnalyisTable.contextTypes = {
    d2: PropTypes.object,
};

export default OutlierAnalyisTable;
