import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import DownloadAs from '../../../components/DownloadAs/DownloadAs'
import { apiConf } from '../../../server.conf'
import cssPageStyles from '../../Page.module.css'
import { Z_SCORE, MIN_MAX } from '../constants'
import ElementRow from './ElementRow'
import styles from './OutlierAnalysisTable.module.css'

const OutlierAnalyisTable = ({
    csvQueryStr,
    elements,
    onToggleCheckbox,
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
                    {elements.map(element => (
                        <ElementRow
                            key={element.key}
                            element={element}
                            isZScoreAlgorithm={isZScoreAlgorithm}
                            onToggleCheckbox={onToggleCheckbox}
                        />
                    ))}
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

OutlierAnalyisTable.propTypes = {
    algorithm: PropTypes.oneOf([Z_SCORE, MIN_MAX]).isRequired,
    csvQueryStr: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
    onToggleCheckbox: PropTypes.func.isRequired,
}

export default OutlierAnalyisTable
