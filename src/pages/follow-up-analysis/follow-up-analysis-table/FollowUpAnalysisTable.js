import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import {
    Checkbox,
    RaisedButton,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
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

    handleUnfollowMarked = () => {
        const unfollowups = this.props.elements
            .filter(element => element.marked)
            .map(FollowUpAnalysisTable.convertElementToUnFollowupRequest)
        this.props.unfollow(unfollowups)
    }

    render() {
        const rows = this.props.elements.map(element => {
            const handleMarkedToggle = () => {
                this.props.toggleCheckbox(element)
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
                                onCheck={handleMarkedToggle}
                                iconStyle={jsPageStyles.iconColor}
                            />
                        </span>
                    </TableRowColumn>
                </TableRow>
            )
        })

        return (
            <div>
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
                        primary
                        disabled={
                            this.props.loading ||
                            !this.props.elements.some(e => e.marked)
                        }
                        label={i18n.t('unfollow')}
                        onClick={this.handleUnfollowMarked}
                    />
                    <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
                </div>
            </div>
        )
    }
}

export default FollowUpAnalysisTable
