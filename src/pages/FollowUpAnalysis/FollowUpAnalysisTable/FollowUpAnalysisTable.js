import i18n from '@dhis2/d2-i18n'
import { Button, CircularLoader } from '@dhis2/ui'
import classNames from 'classnames'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    Dialog,
    FlatButton,
} from 'material-ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import DownloadAs from '../../../components/DownloadAs/DownloadAs'
import { apiConf } from '../../../server.conf'
import cssPageStyles from '../../Page.module.css'
import ElementRow from './ElementRow'

const FollowUpAnalysisTable = ({
    elements,
    loading,
    onCheckboxToggle,
    onUnfollow,
}) => {
    const [commentVisible, setCommentVisible] = useState(false)
    const [comment, setComment] = useState(null)

    const handleCloseCommentDialog = () => {
        setCommentVisible(false)
    }
    const handleShowComment = element => {
        setComment(element.comment)
        setCommentVisible(true)
    }

    const oneChecked = elements.some(element => element.marked)

    return (
        <div>
            <Dialog
                title={i18n.t('Comment')}
                actions={[
                    <FlatButton
                        key="Close"
                        label={i18n.t('Close')}
                        primary
                        onClick={handleCloseCommentDialog}
                    />,
                ]}
                modal={false}
                open={commentVisible}
                onRequestClose={handleCloseCommentDialog}
            >
                <div>{comment}</div>
            </Dialog>
            <div className={cssPageStyles.cardHeader}>
                <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
            </div>
            <Table selectable={false} className={cssPageStyles.appTable}>
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
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
                            {i18n.t('Min')}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
                            {i18n.t('Value')}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
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
                    {elements.map(element => (
                        <ElementRow
                            key={element.key}
                            element={element}
                            onCheckboxToggle={() =>
                                onCheckboxToggle(element.key)
                            }
                            onShowComment={() => handleShowComment(element)}
                        />
                    ))}
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
                    disabled={loading || !oneChecked}
                    onClick={onUnfollow}
                >
                    {loading ? (
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

FollowUpAnalysisTable.propTypes = {
    elements: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onCheckboxToggle: PropTypes.func.isRequired,
    onUnfollow: PropTypes.func.isRequired,
}

export default FollowUpAnalysisTable
