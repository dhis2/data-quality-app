import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {
    Checkbox, FontIcon, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn,
} from 'material-ui';

import FormattedNumber from '../../components/formatters/FormattedNumber';
import DownloadAs from '../../components/download-as/DownloadAs';
import { i18nKeys } from '../../i18n';

// styles
import cssPageStyles from '../Page.css';
import jsPageStyles from '../PageStyles';
import followUpAnalysisTableStyles from './FollowUpAnalysisTableStyles';

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
        let i = 0;
        for (i; i < 5; i++) {
            const one = {
                label: i,
                dataElement: `Bananas ${i}`,
                organisation: `Organisation ${i}`,
                period: 'Mês do Ano X',
                min: 10,
                max: 99999,
                value: 12345678,
                comment: 'A beautiful comment!',
            };
            elements.push(one);
        }

        const toggleCheckbox = (() => {
        });

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
                        iconStyle={followUpAnalysisTableStyles.iconColor}
                    />
                </TableRowColumn>
                <TableRowColumn>
                    <FontIcon
                        className={'material-icons'}
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
                            <TableHeaderColumn>Data Element</TableHeaderColumn>
                            <TableHeaderColumn>Organisation Unit</TableHeaderColumn>
                            <TableHeaderColumn>Period</TableHeaderColumn>
                            <TableHeaderColumn>Min</TableHeaderColumn>
                            <TableHeaderColumn>Value</TableHeaderColumn>
                            <TableHeaderColumn>Max</TableHeaderColumn>
                            <TableHeaderColumn>Unfollow</TableHeaderColumn>
                            <TableHeaderColumn>Comment</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={false}>
                        {rows}
                    </TableBody>
                </Table>
                <div className={cssPageStyles.cardFooter}>
                    <span>
                        <RaisedButton
                            primary={Boolean(true)}
                            label={translator(i18nKeys.followUpAnalysis.actionButtonUnfollow)}
                            onClick={FollowUpAnalysisTable.unfollow}
                        />
                    </span>
                    <span>
                        <DownloadAs />
                    </span>
                </div>
            </div>
        );
    }
}

export default FollowUpAnalysisTable;
