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
import DownloadAs from '../../../components/DownloadAs/DownloadAs.js'
import { apiConf } from '../../../server.conf.js'
import cssPageStyles from '../../Page.module.css'
import ElementRow from './ElementRow.js'
import styles from './ValidationRulesAnalysisTable.module.css'

const ValidationRulesAnalysisTable = ({ elements }) => {
    const shouldDisplayAttributeOptionCombo = elements.some(
        (e) => e.attributeOptionCombo && e.attributeOptionCombo !== 'default'
    )

    return (
        <div>
            <div className={cssPageStyles.cardHeader}>
                <DownloadAs
                    endpoint={apiConf.endpoints.validationRulesReport}
                />
            </div>
            <Table
                selectable={false}
                className={classNames(
                    cssPageStyles.appTable,
                    styles.validationTable
                )}
                fixedHeader={false}
                bodyStyle={{ overflowX: 'auto' }}
            >
                <TableHeader
                    displaySelectAll={false}
                    adjustForCheckbox={false}
                    enableSelectAll={false}
                >
                    <TableRow>
                        <TableHeaderColumn title={i18n.t('Organisation Unit')}>
                            {i18n.t('Organisation Unit')}
                        </TableHeaderColumn>
                        {shouldDisplayAttributeOptionCombo && (
                            <TableHeaderColumn
                                title={i18n.t('Attribute Option Combination')}
                            >
                                {i18n.t('Attr. Opt. Combo')}
                            </TableHeaderColumn>
                        )}
                        <TableHeaderColumn title={i18n.t('Period')}>
                            {i18n.t('Period')}
                        </TableHeaderColumn>
                        <TableHeaderColumn title={i18n.t('Importance')}>
                            {i18n.t('Importance')}
                        </TableHeaderColumn>
                        <TableHeaderColumn title={i18n.t('Validation Rule')}>
                            {i18n.t('Validation Rule')}
                        </TableHeaderColumn>
                        <TableHeaderColumn title={i18n.t('Value')}>
                            {i18n.t('Value')}
                        </TableHeaderColumn>
                        <TableHeaderColumn title={i18n.t('Operator')}>
                            {i18n.t('Operator')}
                        </TableHeaderColumn>
                        <TableHeaderColumn title={i18n.t('Value')}>
                            {i18n.t('Value')}
                        </TableHeaderColumn>
                        <TableHeaderColumn title={i18n.t('Details')}>
                            {i18n.t('Details')}
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} stripedRows={false}>
                    {elements.map((element) => (
                        <ElementRow
                            key={element.key}
                            element={element}
                            shouldDisplayAttributeOptionCombo={
                                shouldDisplayAttributeOptionCombo
                            }
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
                <DownloadAs
                    endpoint={apiConf.endpoints.validationRulesReport}
                />
            </div>
        </div>
    )
}

ValidationRulesAnalysisTable.propTypes = {
    elements: PropTypes.array.isRequired,
}

export default ValidationRulesAnalysisTable
