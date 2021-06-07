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

    state = {
        showComment: false,
        comment: null,
    }

    handleCloseCommentDialog = () => {
        this.setState({ showComment: false })
    }

    handleShowComment(element) {
        this.setState({
            showComment: true,
            comment: element.comment,
        })
    }

    render() {
        let oneChecked = false

        // Table Rows
        const rows = this.props.elements.map(element => {
            const handleCheckboxToggle = () => {
                this.props.onCheckboxToggle(element.key)
            }

            const handleShowComment = () => {
                this.handleShowComment(element)
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
                                onCheck={handleCheckboxToggle}
                                iconStyle={jsPageStyles.iconColor}
                            />
                        </span>
                    </TableRowColumn>
                    <TableRowColumn className={cssPageStyles.center}>
                        {element.comment && (
                            <IconButton onClick={handleShowComment}>
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
                    actions={[
                        <FlatButton
                            key="Close"
                            label={i18n.t('Close')}
                            primary
                            onClick={this.handleCloseCommentDialog}
                        />,
                    ]}
                    modal={false}
                    open={this.state.showComment}
                    onRequestClose={this.handleCloseCommentDialog}
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
