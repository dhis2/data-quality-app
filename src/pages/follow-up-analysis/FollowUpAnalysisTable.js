import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// import classNames from 'classnames';

import {
    Card, Checkbox, FlatButton, FontIcon, Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn,
} from 'material-ui';

import pageStyles from '../Page.css';
import FormattedNumber from '../../components/formatters/FormattedNumber';
import DownloadAs from '../../components/download-as/DownloadAs';

const styles = {
    iconColor: {
        fill: '#ff9900',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
    },
    downloadBtn: {
        marginRight: '50px',
        backgroundColor: 'green',
    },
};

class FollowUpAnalysisTable extends PureComponent {
    static propTypes = {
        elements: PropTypes.array.isRequired,
    }

    render() {
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
                <TableRowColumn className={pageStyles.number}>
                    <FormattedNumber value={element.min} />
                </TableRowColumn>
                <TableRowColumn className={pageStyles.number}>
                    <FormattedNumber value={element.max} />
                </TableRowColumn>
                <TableRowColumn className={pageStyles.number}>
                    <FormattedNumber value={element.value} />
                </TableRowColumn>
                <TableRowColumn>
                    <Checkbox
                        onCheck={toggleCheckbox}
                        iconStyle={styles.iconColor}
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
            <Card>
                <div className={'col-xs-12 end-xs'}>
                    <DownloadAs />
                </div>
                <Table
                    selectable={false}
                    className={pageStyles.appTable}
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={'col-xs-2'}>
                        <FlatButton>UNFOLLOW</FlatButton>
                    </span>
                    <span style={{ textAlign: 'right' }} className={'col-xs-10'}>
                        <DownloadAs />
                    </span>
                </div>
            </Card>
        );
    }
}

export default FollowUpAnalysisTable;
