import { useState } from 'react'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'

const useFormState = () => {
    const [startDate, setStartDate] = useState(threeMonthsAgo())
    const [endDate, setEndDate] = useState(new Date())
    const [organisationUnitId, setOrganisationUnitId] = useState(null)
    const [dataSetIds, setDataSetIds] = useState([])

    const handleStartDateChange = (event, date) => {
        setStartDate(new Date(date))
    }
    const handleEndDateChange = (event, date) => {
        setEndDate(new Date(date))
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
