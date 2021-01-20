import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
    Checkbox,
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui'
import FormattedNumber from '../../components/formatters/FormattedNumber'
import DownloadAs from '../../components/download-as/DownloadAs'
import i18n from '@dhis2/d2-i18n'
import { apiConf } from '../../server.conf'
import cssPageStyles from '../../pages/Page.module.css'
import jsPageStyles from '../../pages/PageStyles'
import styles from './OutlierAnalysisTable.module.css'

const OutlierAnalyisTable = ({ elements, toggleCheckbox, algorithm }) => {
    const isZScoreAlgorithm = algorithm === 'Z_SCORE'

    // Table Rows
    const rows = elements.map(element => {
        const updateCheckbox = () => {
            toggleCheckbox(element)
        }

        return (
            <TableRow key={element.key}>
                <TableRowColumn>{element.deName}</TableRowColumn>
                <TableRowColumn>{element.pe}</TableRowColumn>
                <TableRowColumn>{element.ouName}</TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.lowerBound} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.value} />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.upperBound} />
                </TableRowColumn>
                {isZScoreAlgorithm && (
                    <TableRowColumn className={cssPageStyles.right}>
                        <FormattedNumber value={element.zScore} />
                    </TableRowColumn>
                )}
                {isZScoreAlgorithm && (
                    <TableRowColumn className={cssPageStyles.right}>
                        <FormattedNumber value={element.mean} />
                    </TableRowColumn>
                )}
                {isZScoreAlgorithm && (
                    <TableRowColumn className={cssPageStyles.right}>
                        <FormattedNumber value={element.stdDev} />
                    </TableRowColumn>
                )}
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber value={element.absDev} />
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
                    styles.outlierAnalysisTable
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
                            {i18n.t('Period')}
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            {i18n.t('Organisation Unit')}
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
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Z-Score')}
                            </TableHeaderColumn>
                        )}
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Mean')}
                            </TableHeaderColumn>
                        )}
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Std Dev')}
                            </TableHeaderColumn>
                        )}
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t('Deviation')}
                        </TableHeaderColumn>

                        <TableHeaderColumn className={cssPageStyles.center}>
                            {i18n.t('Mark')}
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
                    cssPageStyles.end
                )}
            >
                <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
            </div>
        </div>
    )
}

OutlierAnalyisTable.generateElementKey = e =>
    `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${
        e.sourceId
    }-${e.dataElementId}`

OutlierAnalyisTable.convertElementFromApiResponse = (e, index) => ({
    // TODO: Once sourceId is also returned from the API, use this to craft a truly unique ID
    key: `${e.aoc}-${e.coc}-${e.de}-${e.pe}-${index}`,
    // TODO: We should be able to read this value from the API response as well
    marked: false,
    ...e,
})

OutlierAnalyisTable.convertElementToToggleFollowupRequest = e => ({
    dataElementId: e.dataElementId,
    periodId: e.periodId,
    organisationUnitId: e.organisationUnitId,
    categoryOptionComboId: e.categoryOptionComboId,
    attributeOptionComboId: e.attributeOptionComboId,
    followup: !e.marked,
})

OutlierAnalyisTable.propTypes = {
    algorithm: PropTypes.oneOf(['Z_SCORE', 'MIN_MAX']),
    elements: PropTypes.array.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
}

OutlierAnalyisTable.contextTypes = {
    d2: PropTypes.object,
}

export default OutlierAnalyisTable
