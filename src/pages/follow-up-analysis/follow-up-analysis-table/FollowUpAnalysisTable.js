import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Checkbox, FontIcon, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn,
} from 'material-ui';

import FormattedNumber from '../../../components/formatters/FormattedNumber';
import DownloadAs from '../../../components/download-as/DownloadAs';
import { i18nKeys } from '../../../i18n';

// styles
import cssPageStyles from '../../Page.css';
import jsPageStyles from '../../PageStyles';

class FollowUpAnalysisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
        d2: PropTypes.object,
    }

    static unfollow() {
        console.log('Unfollow not implemented yet!');
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
                    <FormattedNumber value={element.max} />
                </TableRowColumn>
                <TableRowColumn className={jsPageStyles.number}>
                    <FormattedNumber value={element.value} />
                </TableRowColumn>
                <TableRowColumn>
                    <Checkbox
                        onCheck={toggleCheckbox}
                        iconStyle={jsPageStyles.iconColor}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <FontIcon
                        className={'material-icons'}
                        style={jsPageStyles.cursorStyle}
                    >
                        speaker_notes
                    </FontIcon>
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
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.dataElement)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.organisationUnit)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.period)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.min)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.max)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.unfollow)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {translator(i18nKeys.followUpAnalysis.tableHeaderColumn.comment)}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={false}>
                        {rows}
                    </TableBody>
                </Table>
                <div className={classNames(cssPageStyles.cardFooter, cssPageStyles.spaceBetween)}>
                    <RaisedButton
                        primary={Boolean(true)}
                        label={translator(i18nKeys.followUpAnalysis.actionButtonUnfollow)}
                        onClick={FollowUpAnalysisTable.unfollow}
                    />
                    <DownloadAs />
                </div>
            </div>
        );
    }
}

export default FollowUpAnalysisTable;
