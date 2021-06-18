import { useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import MaxResultsAlertBar from '../../components/MaxResultsAlertBar/MaxResultsAlertBar'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useSidebar } from '../../components/Sidebar/SidebarContext'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import { apiConf } from '../../server.conf'
import cssPageStyles from '../Page.module.css'
import convertElementFromApiResponse from './convert-element-from-api-response'
import Form from './Form'
import useFormState from './use-form-state'
import { ALL_VALIDATION_RULE_GROUPS_ID } from './ValidationRuleGroupsSelect'
import ValidationRulesAnalysisTable from './ValidationRulesAnalysisTable/ValidationRulesAnalysisTable'

const ValidationRulesAnalysis = ({ sectionKey }) => {
    const sidebar = useSidebar()
    const [loading, setLoading] = useState(false)
    const [tableVisible, setTableVisible] = useState(false)
    const [elements, setElements] = useState([])
    const { d2 } = useD2()
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

    const showForm = () => {
        setTableVisible(false)
        sidebar.show()
    }
    const showTable = () => {
        setTableVisible(true)
        sidebar.hide()
    }

    const handleValidate = async () => {
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
                showTable()
            } else {
                validationPassedAlert.show()
            }
        } catch (error) {
            errorAlert.show({ error })
        }
        setLoading(false)
    }
    const formValid = !!(startDate && endDate && organisationUnitId)
    const shouldShowMaxResultsAlertBar =
        tableVisible && elements.length >= apiConf.results.analysis.limit

    return (
        <div>
            <PageHeader
                title={i18n.t('Validation Rule Analysis')}
                onBack={tableVisible ? showForm : null}
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
                        valid={formValid}
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
