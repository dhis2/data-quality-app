import { useConfig } from '@dhis2/app-runtime'
import { useState } from 'react'
import { getCalendarDate } from '../../helpers/dates.js'

const useFormState = () => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const [startDate, setStartDate] = useState(
        getCalendarDate(calendar, { months: -3 })
    )
    const [endDate, setEndDate] = useState(getCalendarDate(calendar))
    const [organisationUnitId, setOrganisationUnitId] = useState(null)
    const [dataSetIds, setDataSetIds] = useState([])

    const handleStartDateChange = selectedDate => {
        const date = selectedDate?.calendarDateString
        setStartDate(date)
    }
    const handleEndDateChange = selectedDate => {
        const date = selectedDate?.calendarDateString
        setEndDate(date)
    }
    const handleDataSetsChange = ({ selected }) => {
        setDataSetIds(selected)
    }

    return {
        startDate,
        handleStartDateChange,
        endDate,
        handleEndDateChange,
        organisationUnitId,
        handleOrganisationUnitChange: setOrganisationUnitId,
        dataSetIds,
        handleDataSetsChange,
    }
}

export default useFormState
