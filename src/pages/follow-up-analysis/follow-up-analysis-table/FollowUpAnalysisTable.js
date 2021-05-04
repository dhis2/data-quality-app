import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Checkbox,
    Table,
    TableHead,
    TableRowHead,
    TableCellHead,
    TableBody,
    TableRow,
    TableCell,
} from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import DownloadAs from '../../../components/download-as/DownloadAs'
import FormattedNumber from '../../../components/formatters/FormattedNumber'
import { apiConf } from '../../../server.conf'
import cssPageStyles from '../../Page.module.css'
import styles from './FollowUpAnalysisTable.module.css'

const Footer = ({ submitButtonDisabled, onSubmit }) => (
    <div
        className={classNames(
            cssPageStyles.cardFooter,
            cssPageStyles.spaceBetween
        )}
    >
        <Button primary disabled={submitButtonDisabled} onClick={onSubmit}>
            {i18n.t('Unfollow elements')}
        </Button>
        <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
    </div>
)

Footer.propTypes = {
    submitButtonDisabled: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
}

const convertElementToUnFollowupRequest = e => ({
    dataElement: e.dataElementId,
    period: e.periodId,
    orgUnit: e.organisationUnitId,
    categoryOptionCombo: e.categoryOptionComboId,
    attributeOptionCombo: e.attributeOptionComboId,
    followup: false,
})

const ElementRow = ({ element, onCheckboxToggle }) => {
    const handleMarkedToggle = () => {
        onCheckboxToggle(element)
    }

    return (
        <TableRow>
            <TableCell>{element.dataElement}</TableCell>
            <TableCell>{element.organisation}</TableCell>
            <TableCell>{element.period}</TableCell>
            <TableCell className={styles.formattedNumberColumn}>
                <FormattedNumber value={element.min} />
            </TableCell>
            <TableCell className={styles.formattedNumberColumn}>
                <FormattedNumber value={element.value} />
            </TableCell>
            <TableCell className={styles.formattedNumberColumn}>
                <FormattedNumber value={element.max} />
            </TableCell>
            <TableCell className={cssPageStyles.centerFlex}>
                <Checkbox
                    checked={element.marked}
                    onChange={handleMarkedToggle}
                />
            </TableCell>
        </TableRow>
    )
}

ElementRow.propTypes = {
    element: PropTypes.object.isRequired,
    onCheckboxToggle: PropTypes.func.isRequired,
}

const FollowUpAnalysisTable = ({
    elements,
    loading,
    onCheckboxToggle,
    onBatchUnfollow,
}) => {
    const handleBatchUnfollow = () => {
        const unfollowups = elements
            .filter(element => element.marked)
            .map(convertElementToUnFollowupRequest)
        onBatchUnfollow(unfollowups)
    }

    return (
        <>
            <div className={cssPageStyles.cardHeader}>
                <DownloadAs endpoint={apiConf.endpoints.reportAnalysis} />
            </div>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>{i18n.t('Data Element')}</TableCellHead>
                        <TableCellHead>
                            {i18n.t('Organisation Unit')}
                        </TableCellHead>
                        <TableCellHead>{i18n.t('Period')}</TableCellHead>
                        <TableCellHead className={styles.formattedNumberColumn}>
                            {i18n.t('Min')}
                        </TableCellHead>
                        <TableCellHead className={styles.formattedNumberColumn}>
                            {i18n.t('Value')}
                        </TableCellHead>
                        <TableCellHead className={styles.formattedNumberColumn}>
                            {i18n.t('Max')}
                        </TableCellHead>
                        <TableCellHead className={cssPageStyles.center}>
                            {i18n.t('Unfollow')}
                        </TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {elements.map(element => (
                        <ElementRow
                            key={element.key}
                            element={element}
                            onCheckboxToggle={onCheckboxToggle}
                        />
                    ))}
                </TableBody>
            </Table>
            <Footer
                submitButtonDisabled={loading || !elements.some(e => e.marked)}
                onSubmit={handleBatchUnfollow}
            />
        </>
    )
}

FollowUpAnalysisTable.propTypes = {
    elements: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    onBatchUnfollow: PropTypes.func.isRequired,
    onCheckboxToggle: PropTypes.func.isRequired,
}

export default FollowUpAnalysisTable
