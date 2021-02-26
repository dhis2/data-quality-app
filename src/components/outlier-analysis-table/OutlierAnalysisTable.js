import i18n from '@dhis2/d2-i18n'
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
import PropTypes from 'prop-types'
import React from 'react'
import DownloadAs from '../../components/download-as/DownloadAs'
import FormattedNumber from '../../components/formatters/FormattedNumber'
import { Z_SCORE } from '../../pages/outlier-detection/constants'
import cssPageStyles from '../../pages/Page.module.css'
import jsPageStyles from '../../pages/PageStyles'
import { apiConf } from '../../server.conf'
import styles from './OutlierAnalysisTable.module.css'

const OutlierAnalyisTable = ({
    csvQueryStr,
    elements,
    toggleCheckbox,
    algorithm,
}) => {
    const isZScoreAlgorithm = algorithm === Z_SCORE

    const downloadLink = (
        <DownloadAs
            fileTypes={['csv']}
            endpoint={apiConf.endpoints.outlierDetection}
            queryStr={csvQueryStr}
        />
    )

    // Table Rows
    const rows = elements.map(element => {
        const updateCheckbox = () => {
            toggleCheckbox(element)
        }

        return (
            <TableRow key={element.key}>
                <TableRowColumn>
                    <span title={element.displayName}>
                        {element.displayName}
                    </span>
                </TableRowColumn>
                <TableRowColumn>{element.pe}</TableRowColumn>
                <TableRowColumn>
                    <span title={element.ouName}>{element.ouName}</span>
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber
                        value={element.value}
                        minimumFractionDigits={0}
                    />
                </TableRowColumn>
                {isZScoreAlgorithm && (
                    <TableRowColumn className={cssPageStyles.right}>
                        <FormattedNumber value={element.zScore} />
                    </TableRowColumn>
                )}
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber
                        value={element.absDev}
                        minimumFractionDigits={0}
                    />
                </TableRowColumn>
                {isZScoreAlgorithm && (
                    <TableRowColumn className={cssPageStyles.right}>
                        <FormattedNumber value={element.stdDev} />
                    </TableRowColumn>
                )}
                {isZScoreAlgorithm && (
                    <TableRowColumn className={cssPageStyles.right}>
                        <FormattedNumber
                            value={element.mean}
                            minimumFractionDigits={0}
                        />
                    </TableRowColumn>
                )}
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber
                        value={element.lowerBound}
                        minimumFractionDigits={0}
                    />
                </TableRowColumn>
                <TableRowColumn className={cssPageStyles.right}>
                    <FormattedNumber
                        value={element.upperBound}
                        minimumFractionDigits={0}
                    />
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
            <div className={cssPageStyles.cardHeader}>{downloadLink}</div>
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
                            {i18n.t('Value')}
                        </TableHeaderColumn>
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Z-Score')}
                            </TableHeaderColumn>
                        )}
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t('Deviation')}
                        </TableHeaderColumn>
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Std Dev')}
                            </TableHeaderColumn>
                        )}
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn className={cssPageStyles.right}>
                                {i18n.t('Mean')}
                            </TableHeaderColumn>
                        )}
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t('Min')}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.right}>
                            {i18n.t('Max')}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.center}>
                            {i18n.t('Follow-up')}
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
                {downloadLink}
            </div>
        </div>
    )
}

OutlierAnalyisTable.generateElementKey = e =>
    `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`

OutlierAnalyisTable.convertElementFromApiResponse = e => ({
    displayName: getDisplayName(e),
    key: `${e.aoc}-${e.coc}-${e.de}-${e.pe}-${e.ou}`,
    marked: e.followup,
    ...e,
})

OutlierAnalyisTable.convertElementToToggleFollowupRequest = e => ({
    dataElement: e.de,
    period: e.pe,
    orgUnit: e.ou,
    categoryOptionCombo: e.coc || null,
    attributeOptionCombo: e.aoc || null,
    followup: !e.marked,
})

OutlierAnalyisTable.propTypes = {
    csvQueryStr: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
    toggleCheckbox: PropTypes.func.isRequired,
    algorithm: PropTypes.oneOf([Z_SCORE, 'MIN_MAX']),
}

OutlierAnalyisTable.contextTypes = {
    d2: PropTypes.object,
}

function getDisplayName(e) {
    let str = e.deName

    // In the context of a dataElement, the default COC or AOC means "none".
    // The "default" string is not localised, and probably won't ever be.
    // That is why the conditions below should work in the foreseeable future.
    if (e.cocName !== 'default') {
        str += ` (${e.cocName})`
    }

    if (e.aocName !== 'default') {
        str += ` (${e.aocName})`
    }

    return str
}

export default OutlierAnalyisTable
