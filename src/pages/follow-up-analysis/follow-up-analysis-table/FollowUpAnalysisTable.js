import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import {
    Checkbox,
    FontIcon,
    RaisedButton,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    IconButton,
    Dialog,
    FlatButton,
} from 'material-ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import DownloadAs from '../../../components/download-as/DownloadAs'
import FormattedNumber from '../../../components/formatters/FormattedNumber'
import { apiConf } from '../../../server.conf'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles'
import styles from './FollowUpAnalysisTable.module.css'

class FollowUpAnalysisTable extends Component {
    static propTypes = {
        elements: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        toggleCheckbox: PropTypes.func.isRequired,
        unfollow: PropTypes.func.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
    }

    static convertElementFromApiResponse = e => ({
        key: `${e.aoc}-${e.coc}-${e.pe}-${e.ou}-${e.de}`,
        attributeOptionComboId: e.aoc,
        categoryOptionComboId: e.coc,
        periodId: e.pe,
        period: e.pe,
        organisationUnitId: e.ou,
        organisation: e.ouName,
        dataElementId: e.de,
        dataElement: e.deName,
        min: e.min,
        max: e.max,
        value: Number.parseFloat(e.value, 10),
        marked: false,
    })

    static convertElementToUnFollowupRequest = e => ({
        dataElementId: e.dataElementId,
        periodId: e.periodId,
        organisationUnitId: e.organisationUnitId,
        categoryOptionComboId: e.categoryOptionComboId,
        attributeOptionComboId: e.attributeOptionComboId,
        followup: false,
    })

    static areElementsTheSame(element1, element2) {
        return (
            element1.attributeOptionComboId ===
                element2.attributeOptionComboId &&
            element1.categoryOptionComboId === element2.categoryOptionComboId &&
            element1.periodId === element2.periodId &&
            element1.organisationUnitId === element2.organisationUnitId &&
            element1.dataElementId === element2.dataElementId
        )
    }

    constructor() {
        super()

        this.state = {
            showComment: false,
            comment: null,
        }

        this.unfollow = this.unfollow.bind(this)
        this.closeCommentDialog = this.closeCommentDialog.bind(this)
    }

    unfollow() {
        const unfollowups = []
        for (let i = 0; i < this.props.elements.length; i++) {
            const e = this.props.elements[i]
            if (e.marked) {
                unfollowups.push(
                    FollowUpAnalysisTable.convertElementToUnFollowupRequest(e)
                )
            }
        }

        this.props.unfollow(unfollowups)
    }

    closeCommentDialog() {
        this.setState({ showComment: false })
    }

    updateCheckbox(element) {
        this.props.toggleCheckbox(element)
    }

    showComment(element) {
        if (element.comment) {
            this.setState({
                showComment: true,
                comment: element.comment,
            })
        }
    }

    render() {
        let oneChecked = false

        const commentDialogActions = [
            <FlatButton
                key={'close'}
                label={i18n.t('Close')}
                primary
                onClick={this.closeCommentDialog}
            />,
        ]

        // Table Rows
        const rows = this.props.elements.map(element => {
            const updateCheckbox = () => {
                this.updateCheckbox(element)
            }

            const showComment = () => {
                this.showComment(element)
            }

            oneChecked = element.marked ? true : oneChecked

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
                        {element.comment && (
                            <IconButton key={element.key} onClick={showComment}>
                                <FontIcon
                                    className={'material-icons'}
                                    style={jsPageStyles.cursorStyle}
                                >
                                    speaker_notes
                                </FontIcon>
                            </IconButton>
                        )}
                    </TableRowColumn>
                </TableRow>
            )
        })

        return (
            <div>
                <Dialog
                    title={i18n.t('Comment')}
                    actions={commentDialogActions}
                    modal={false}
                    open={this.state.showComment}
                    onRequestClose={this.closeCommentDialog}
                >
                    <div id={'comment-content'}>{this.state.comment}</div>
                </Dialog>
                <div className={cssPageStyles.cardHeader}>
                    <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
                </div>
                <Table
                    selectable={false}
                    className={classNames(
                        cssPageStyles.appTable,
                        styles.followUpAnalysisTable
                    )}
                >
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        enableSelectAll={false}
                    >
                        <TableRow>
                            <TableHeaderColumn>
                                {i18n.t('Data Element')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t('Organisation Unit')}
                            </TableHeaderColumn>
                            <TableHeaderColumn>
                                {i18n.t('Period')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Min')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Value')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Max')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.center}>
                                {i18n.t('Unfollow')}
                            </TableHeaderColumn>
                            <TableHeaderColumn className={cssPageStyles.center}>
                                {i18n.t('Comment')}
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
                        cssPageStyles.spaceBetween
                    )}
                >
                    <RaisedButton
                        id="unfollow-action"
                        primary
                        disabled={this.props.loading || !oneChecked}
                        label={i18n.t('unfollow')}
                        onClick={this.unfollow}
                    />
                    <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
                </div>
            </div>
        )
    }
}

export default FollowUpAnalysisTable
