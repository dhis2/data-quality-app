import { useState } from 'react'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'
import { ALL_VALIDATION_RULE_GROUPS_ID } from './ValidationRuleGroupsSelect'

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
        handleValidationRuleGroupChange: setValidationRuleGroupId,
        sendNotfications,
        handleSendNotificationsChange,
        persistNewResults,
        handlePersistNewResultsChange,
    }
}

export default useFormState
