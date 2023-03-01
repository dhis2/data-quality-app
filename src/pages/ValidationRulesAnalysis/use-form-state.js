import { useConfig } from '@dhis2/app-runtime'
import { useState } from 'react'
import { getCalendarDate } from '../../helpers/dates.js'
import { ALL_VALIDATION_RULE_GROUPS_ID } from './ValidationRuleGroupsSelect.js'

const useFormState = () => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo
    const [organisationUnitId, setOrganisationUnitId] = useState(null)
    const [startDate, setStartDate] = useState(
        getCalendarDate(calendar, { months: -3 })
    )
    const [endDate, setEndDate] = useState(getCalendarDate(calendar))
    const [validationRuleGroupId, setValidationRuleGroupId] = useState(
        ALL_VALIDATION_RULE_GROUPS_ID
    )
    const [sendNotfications, setSendNotifications] = useState(false)
    const [persistNewResults, setPersistNewResults] = useState(false)

    const handleStartDateChange = (selectedDate) => {
        const date = selectedDate?.calendarDateString
        setStartDate(date)
    }
    const handleEndDateChange = (selectedDate) => {
        const date = selectedDate?.calendarDateString
        setEndDate(date)
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
