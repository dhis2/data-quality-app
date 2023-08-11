import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    FlatButton
} from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import cssPageStyles from '../../Page.module.css'
import {
    Z_SCORE_ALGORITHMS,
    ALGORITHM_TO_LABEL_MAP,
    Z_SCORE,
} from '../constants.js'
import ElementRow from './ElementRow.js'
import styles from './OutlierAnalysisTable.module.css'
import { downloadXlsxFile } from '../../../helpers/file.js'

const OutlierAnalyisTable = ({
    csvQueryStr,
    elements,
    onToggleCheckbox,
    algorithm,
}) => {
    const isZScoreAlgorithm = Z_SCORE_ALGORITHMS.has(algorithm)

    const downloadLink = (
        <FlatButton primary={ true } label={'Download Xls'} onClick = { (_e)=>downloadXlsxFile(elements)}/>
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
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
                            {i18n.t('Value')}
                        </TableHeaderColumn>
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn
                                className={cssPageStyles.numericalRow}
                            >
                                {ALGORITHM_TO_LABEL_MAP[algorithm]}
                            </TableHeaderColumn>
                        )}
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
                            {i18n.t('Deviation')}
                        </TableHeaderColumn>
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn
                                className={cssPageStyles.numericalRow}
                            >
                                {i18n.t('Std Dev')}
                            </TableHeaderColumn>
                        )}
                        {isZScoreAlgorithm && (
                            <TableHeaderColumn
                                className={cssPageStyles.numericalRow}
                            >
                                {algorithm === Z_SCORE
                                    ? i18n.t('Mean')
                                    : i18n.t('Median')}
                            </TableHeaderColumn>
                        )}
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
                            {i18n.t('Min')}
                        </TableHeaderColumn>
                        <TableHeaderColumn
                            className={cssPageStyles.numericalRow}
                        >
                            {i18n.t('Max')}
                        </TableHeaderColumn>
                        <TableHeaderColumn className={cssPageStyles.center}>
                            {i18n.t('Follow-up')}
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={false}>
                    {elements.map((element) => (
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
    algorithm: PropTypes.oneOf(Array.from(Z_SCORE_ALGORITHMS)).isRequired,
    csvQueryStr: PropTypes.string.isRequired,
    elements: PropTypes.array.isRequired,
    onToggleCheckbox: PropTypes.func.isRequired,
}

export default OutlierAnalyisTable
