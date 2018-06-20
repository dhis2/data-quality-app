import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
    Checkbox, FontIcon, RaisedButton, Table, TableBody, TableHeader, TableHeaderColumn, TableRow,
    TableRowColumn, IconButton, Dialog, FlatButton,
} from 'material-ui';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

import FormattedNumber from '../../../components/formatters/FormattedNumber';
import DownloadAs from '../../../components/download-as/DownloadAs';

// styles
import cssPageStyles from '../../Page.css';
import jsPageStyles from '../../PageStyles';
import styles from './FollowUpAnalysisTable.css';

import { apiConf } from '../../../server.conf';

class FollowUpAnalysisTable extends Component {
    static propTypes = {
        elements: PropTypes.array.isRequired,
        toggleCheckbox: PropTypes.func.isRequired,
        unfollow: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
    }

    static generateElementKey = e =>
        `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`;

    static convertElementFromApiResponse = e => ({
        key: FollowUpAnalysisTable.generateElementKey(e),
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
        value: Number.parseFloat(e.value, 10),
        marked: !e.followup,
        comment: e.comment,
    });

    static convertElementToUnFollowupRequest = e => ({
        dataElementId: e.dataElementId,
        periodId: e.periodId,
        organisationUnitId: e.organisationUnitId,
        categoryOptionComboId: e.categoryOptionComboId,
        attributeOptionComboId: e.attributeOptionComboId,
        followup: false,
    });

    static areElementsTheSame(element1, element2) {
        return element1.attributeOptionComboId === element2.attributeOptionComboId &&
          element1.categoryOptionComboId === element2.categoryOptionComboId &&
          element1.periodId === element2.periodId &&
          element1.organisationUnitId === element2.organisationUnitId &&
          element1.dataElementId === element2.dataElementId;
    }

    constructor() {
        super();

        this.state = {
            showComment: false,
            comment: null,
        };

        this.unfollow = this.unfollow.bind(this);
        this.closeCommentDialog = this.closeCommentDialog.bind(this);
    }

    unfollow() {
        const unfollowups = [];
        for (let i = 0; i < this.props.elements.length; i++) {
            const e = this.props.elements[i];
            if (e.marked) {
                unfollowups.push(FollowUpAnalysisTable.convertElementToUnFollowupRequest(e));
            }
        }

        this.props.unfollow(unfollowups);
    }

    closeCommentDialog() {
        this.setState({ showComment: false });
    }

    updateCheckbox(element) {
        this.props.toggleCheckbox(element);
    }

    showComment(element) {
        if (element.comment) {
            this.setState({
                showComment: true,
                comment: element.comment,
            });
        }
    }

    render() {
        let oneChecked = false;

        const commentDialogActions = [
            <FlatButton
                label={i18nKeys.followUpAnalysis.commentModal.close}
                primary
                onClick={this.closeCommentDialog}
            />,
        ];

        // Table Rows
        const rows = this.props.elements.map((element) => {
            const updateCheckbox = (() => {
                this.updateCheckbox(element);
            });

            const showComment = (() => {
                this.showComment(element);
            });

            oneChecked = element.marked ? true : oneChecked;

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
                    <TableRowColumn className={cssPageStyles.center}>
                        {element.comment &&
                            <IconButton key={element.key} onClick={showComment} >
                                <FontIcon
                                    className={'material-icons'}
                                    style={jsPageStyles.cursorStyle}
                                >
                                  speaker_notes
                                </FontIcon>
                            </IconButton>
                        }
                    </TableRowColumn>
                </TableRow>
            );
        });

        return (
            <div>
                <Dialog
                    title={i18nKeys.followUpAnalysis.commentModal.title}
                    actions={commentDialogActions}
                    modal={false}
                    open={this.state.showComment}
                    onRequestClose={this.closeCommentDialog}
                >
                    <div id={'comment-content'}>
                        {this.state.comment}
                    </div>
                </Dialog>
                <div className={cssPageStyles.cardHeader}>
                    <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
                </div>
                <Table
                    selectable={false}
                    className={classNames(cssPageStyles.appTable, styles.followUpAnalysisTable)}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.dataElement)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.organisationUnit)}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.period)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.min)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.value)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.max)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.center}>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.unfollow)}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.center}>
                                {i18n.t(i18nKeys.followUpAnalysis.tableHeaderColumn.comment)}
                            </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={false}>
                        {rows}
                    </TableBody>
                </Table>
                <div className={classNames(cssPageStyles.cardFooter, cssPageStyles.spaceBetween)}>
                    <RaisedButton
                        id="unfollow-action"
                        primary
                        disabled={this.props.loading || !oneChecked}
                        label={i18n.t(i18nKeys.followUpAnalysis.actionButtonUnfollow)}
                        onClick={this.unfollow}
                    />
                    <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
                </div>
            </div>
        );
    }
}

export default FollowUpAnalysisTable;
