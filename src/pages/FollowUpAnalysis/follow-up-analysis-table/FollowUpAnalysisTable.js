import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader } from '@dhis2/ui'
import classNames from 'classnames'
import {
    Checkbox,
    FontIcon,
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
import DownloadAs from '../../../components/DownloadAs/DownloadAs'
import FormattedNumber from '../../../components/FormattedNumber/FormattedNumber'
import { apiConf } from '../../../server.conf'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles'
import styles from './FollowUpAnalysisTable.module.css'

class FollowUpAnalysisTable extends Component {
    static propTypes = {
        elements: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        onCheckboxToggle: PropTypes.func.isRequired,
        onUnfollow: PropTypes.func.isRequired,
    }

    static contextTypes = {
        d2: PropTypes.object,
    }

    static generateElementKey = e =>
        `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`

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
    })

    static convertElementToUnFollowupRequest = e => ({
        dataElementId: e.dataElementId,
        periodId: e.periodId,
        organisationUnitId: e.organisationUnitId,
        categoryOptionComboId: e.categoryOptionComboId,
        attributeOptionComboId: e.attributeOptionComboId,
        followup: false,
    })

    state = {
        showComment: false,
        comment: null,
    }

    closeCommentDialog = () => {
        this.setState({ showComment: false })
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
                this.props.onCheckboxToggle(element)
            }

            const showComment = () => {
                this.showComment(element)
            }

            if (element.marked) {
                oneChecked = true
            }

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
                    <div>{this.state.comment}</div>
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
                    <Button
                        primary
                        disabled={this.props.loading || !oneChecked}
                        onClick={this.props.onUnfollow}
                    >
                        {this.props.loading ? (
                            <>
                                {i18n.t('Unfollowing...')}
                                <CircularLoader small />
                            </>
                        ) : (
                            i18n.t('Unfollow')
                        )}
                    </Button>
                    <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
                </div>
            </div>
        )
    }
}

export default FollowUpAnalysisTable
