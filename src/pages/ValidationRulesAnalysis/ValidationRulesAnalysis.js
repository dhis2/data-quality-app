import { useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { PropTypes } from '@dhis2/prop-types'
import { Card } from '@dhis2/ui'
import { getInstance as getD2Instance } from 'd2'
import React, { useState } from 'react'
import MaxResultsAlertBar from '../../components/MaxResultsAlertBar/MaxResultsAlertBar'
import PageHeader from '../../components/PageHeader/PageHeader'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'
import { apiConf } from '../../server.conf'
import cssPageStyles from '../Page.module.css'
import Form from './Form'
import { ALL_VALIDATION_RULE_GROUPS_ID } from './ValidationRuleGroupsSelect'
import ValidationRulesAnalysisTable from './ValidationRulesAnalysisTable/ValidationRulesAnalysisTable'

const generateElementKey = e =>
    `${e.validationRuleId}-${e.periodId}-${e.organisationUnitId}-${e.attributeOptionComboId}`

const convertElementFromApiResponse = e => ({
    key: generateElementKey(e),
    validationRuleId: e.validationRuleId,
    attributeOptionCombo: e.attributeOptionComboDisplayName,
    attributeOptionComboId: e.attributeOptionComboId,
    organisation: e.organisationUnitDisplayName,
    organisationUnitId: e.organisationUnitId,
    period: e.periodDisplayName,
    periodId: e.periodId,
    importance: e.importance,
    validationRule: e.validationRuleDescription,
    leftValue: e.leftSideValue,
    operator: e.operator,
    rightValue: e.rightSideValue,
})

const useFormState = () => {
    const [organisationUnitId, setOrganisationUnitId] = useState(null)
    const [startDate, setStartDate] = useState(threeMonthsAgo())
    const [endDate, setEndDate] = useState(new Date())
    const [validationRuleGroupId, setValidationRuleGroupId] = useState(
        ALL_VALIDATION_RULE_GROUPS_ID
    )
    const [sendNotfications, setSendNotifications] = useState(false)
    const [persistNewResults, setPersistNewResults] = useState(false)

    const handleStartDateChange = (event, date) => {
        setStartDate(new Date(date))
    }
    const handleEndDateChange = (event, date) => {
        setEndDate(new Date(date))
    }
    const handleValidationRuleGroupChange = (event, index, value) => {
        setValidationRuleGroupId(value)
    }
    const handleSendNotificationsChange = ({ checked }) => {
        setSendNotifications(checked)
    }
    const handlePersistNewResultsChange = ({ checked }) => {
        setPersistNewResults(checked)
    }

    return {
        organisationUnitId,
        handleOrganisationUnitChange: setOrganisationUnitId,
        startDate,
        handleStartDateChange,
        endDate,
        handleEndDateChange,
        validationRuleGroupId,
        handleValidationRuleGroupChange,
        sendNotfications,
        handleSendNotificationsChange,
        persistNewResults,
        handlePersistNewResultsChange,
    }
}

const ValidationRulesAnalysis = ({ sectionKey }) => {
    // TODO: Make hook to control sidebar and hide sidebar (using context api under the hood)
    // TODO: Have `showForm` and `showTable` functions that show/hide sidebar
    const [loading, setLoading] = useState(false)
    const [tableVisible, setTableVisible] = useState(false)
    const [elements, setElements] = useState([])
    const {
        organisationUnitId,
        handleOrganisationUnitChange,
        startDate,
        handleStartDateChange,
        endDate,
        handleEndDateChange,
        validationRuleGroupId,
        handleValidationRuleGroupChange,
        sendNotfications,
        handleSendNotificationsChange,
        persistNewResults,
        handlePersistNewResultsChange,
    } = useFormState()
    const validationPassedAlert = useAlert(
        i18n.t('Validation passed successfully'),
        {
            success: true,
        }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            error?.message ||
            i18n.t('An unexpected error happened during analysis'),
        { critical: true }
    )

    const handleBack = () => {
        setTableVisible(false)
    }
    const handleValidate = async () => {
        const d2 = await getD2Instance()
        const api = d2.Api.getApi()

        const request = {
            startDate: convertDateToApiDateFormat(startDate),
            endDate: convertDateToApiDateFormat(endDate),
            ou: organisationUnitId,
            notification: sendNotfications,
            persist: persistNewResults,
        }
        if (validationRuleGroupId !== ALL_VALIDATION_RULE_GROUPS_ID) {
            request.vrg = validationRuleGroupId
        }

        setLoading(true)
        try {
            const response = await api.post(
                apiConf.endpoints.validationRulesAnalysis,
                request
            )
            const elements = response.map(convertElementFromApiResponse)
            setElements(elements)
            if (elements.length > 0) {
                setTableVisible(true)
            } else {
                validationPassedAlert.show()
            }
        } catch (error) {
            errorAlert.show({ error })
        }
        setLoading(false)
    }
    const shouldShowMaxResultsAlertBar =
        tableVisible && elements.length >= apiConf.results.analysis.limit

    return (
        <div>
            <PageHeader
                title={i18n.t('Validation Rule Analysis')}
                onBack={tableVisible ? handleBack : null}
                sectionKey={sectionKey}
            />
            <MaxResultsAlertBar show={shouldShowMaxResultsAlertBar} />
            <Card className={cssPageStyles.card}>
                {/* Hide form instead of not rendering to preserve org unit state */}
                <div
                    style={{
                        display: tableVisible ? 'none' : 'block',
                    }}
                >
                    <Form
                        onSubmit={handleValidate}
                        valid={startDate && endDate && organisationUnitId}
                        loading={loading}
                        onOrganisationUnitChange={handleOrganisationUnitChange}
                        startDate={startDate}
                        onStartDateChange={handleStartDateChange}
                        endDate={endDate}
                        onEndDateChange={handleEndDateChange}
                        onValidationRuleGroupChange={
                            handleValidationRuleGroupChange
                        }
                        sendNotfications={sendNotfications}
                        onSendNotificationsChange={
                            handleSendNotificationsChange
                        }
                        persistNewResults={persistNewResults}
                        onPersistNewResultsChange={
                            handlePersistNewResultsChange
                        }
                    />
                </div>
                {tableVisible && (
                    <ValidationRulesAnalysisTable elements={elements} />
                )}
            </Card>
        </div>
    )
}

ValidationRulesAnalysis.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default ValidationRulesAnalysis
