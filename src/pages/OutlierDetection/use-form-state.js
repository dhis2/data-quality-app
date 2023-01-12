import { useConfig } from '@dhis2/app-runtime'
import { useState } from 'react'
import { getCalendarDate } from '../../helpers/dates.js'
import {
    DEFAULT_THRESHOLD,
    DEFAULT_ALGORITHM,
    DEFAULT_MAX_RESULTS,
    DEFAULT_ORDER_BY,
} from './constants.js'

const useFormState = () => {
    const { systemInfo = {} } = useConfig()
    const { calendar = 'gregory' } = systemInfo

    const [startDate, setStartDate] = useState(
        getCalendarDate(calendar, { months: -3 })
    )
    const [endDate, setEndDate] = useState(getCalendarDate(calendar))
    const [organisationUnitIds, setOrganisationUnitIds] = useState([])
    const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM)
    const [showAdvancedZScoreFields, setShowAdvancedZScoreFields] =
        useState(false)
    const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD)
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
    const [dataStartDate, setDataStartDate] = useState(null)
    const [dataEndDate, setDataEndDate] = useState(null)
    const [dataSetIds, setDataSetIds] = useState([])
    const [maxResults, setMaxResults] = useState(DEFAULT_MAX_RESULTS)

    const handleStartDateChange = (event, date) => {
        setStartDate(date)
    }
    const handleEndDateChange = (event, date) => {
        setEndDate(date)
    }
    const handleAlgorithmChange = (event, index, value) => {
        setAlgorithm(value)
    }
    const handleToggleAdvancedZScoreFields = () => {
        if (showAdvancedZScoreFields) {
            setDataStartDate(null)
            setDataEndDate(null)
            setOrderBy(DEFAULT_ORDER_BY)
        }
        setShowAdvancedZScoreFields(!showAdvancedZScoreFields)
    }
    const handleThresholdChange = (event, index, value) => {
        setThreshold(value)
    }
    const handleOrderByChange = (event, index, value) => {
        setOrderBy(value)
    }
    const handleDataStartDateChange = (date) => {
        setDataStartDate(date)
    }
    const handleDataEndDateChange = (date) => {
        setDataEndDate(date)
    }
    const handleDataSetsChange = ({ selected }) => {
        setDataSetIds(selected)
    }
    const handleMaxResultsChange = (event, index, value) => {
        setMaxResults(value)
    }

    return {
        organisationUnitIds,
        handleOrganisationUnitChange: setOrganisationUnitIds,
        startDate,
        handleStartDateChange,
        endDate,
        handleEndDateChange,
        algorithm,
        handleAlgorithmChange,
        showAdvancedZScoreFields,
        handleToggleAdvancedZScoreFields,
        threshold,
        handleThresholdChange,
        orderBy,
        handleOrderByChange,
        dataStartDate,
        handleDataStartDateChange,
        dataEndDate,
        handleDataEndDateChange,
        dataSetIds,
        handleDataSetsChange,
        maxResults,
        handleMaxResultsChange,
    }
}

export default useFormState
