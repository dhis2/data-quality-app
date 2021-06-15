import { useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import React, { useState } from 'react'
import MaxResultsAlertBar from '../../components/MaxResultsAlertBar/MaxResultsAlertBar'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useSidebar } from '../../components/Sidebar/SidebarContext'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'
import { apiConf } from '../../server.conf'
import cssPageStyles from '../Page.module.css'
import {
    Z_SCORE,
    DEFAULT_THRESHOLD,
    DEFAULT_ALGORITHM,
    DEFAULT_MAX_RESULTS,
    DEFAULT_ORDER_BY,
} from './constants'
import Form from './Form'
import OutlierAnalyisTable from './OutlierAnalysisTable/OutlierAnalysisTable'

const getElementDisplayName = e => {
    let str = e.deName

    // In the context of a dataElement, the default COC or AOC means "none".
    // The "default" string is not localised, and probably won't ever be.
    // That is why the conditions below should work in the foreseeable future.
    if (e.cocName !== 'default') {
        str += ` (${e.cocName})`
    }

    if (e.aocName !== 'default') {
        str += ` (${e.aocName})`
    }

    return str
}

const convertElementFromApiResponse = e => ({
    displayName: getElementDisplayName(e),
    key: `${e.aoc}-${e.coc}-${e.de}-${e.pe}-${e.ou}`,
    marked: e.followup,
    ...e,
})

const convertElementToToggleFollowupRequest = e => ({
    dataElement: e.de,
    period: e.pe,
    orgUnit: e.ou,
    categoryOptionCombo: e.coc || null,
    attributeOptionCombo: e.aoc || null,
    followup: !e.marked,
})

const useFormState = () => {
    const [startDate, setStartDate] = useState(threeMonthsAgo())
    const [endDate, setEndDate] = useState(new Date())
    const [organisationUnitIds, setOrganisationUnitIds] = useState([])
    const [algorithm, setAlgorithm] = useState(DEFAULT_ALGORITHM)
    const [showAdvancedZScoreFields, setShowAdvancedZScoreFields] = useState(
        false
    )
    const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD)
    const [orderBy, setOrderBy] = useState(DEFAULT_ORDER_BY)
    const [dataStartDate, setDataStartDate] = useState(null)
    const [dataEndDate, setDataEndDate] = useState(null)
    const [dataSetIds, setDataSetIds] = useState([])
    const [maxResults, setMaxResults] = useState(DEFAULT_MAX_RESULTS)

    const handleStartDateChange = (event, date) => {
        setStartDate(new Date(date))
    }
    const handleEndDateChange = (event, date) => {
        setEndDate(new Date(date))
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
    const handleDataStartDateChange = date => {
        setDataStartDate(date && new Date(date))
    }
    const handleDataEndDateChange = date => {
        setDataEndDate(date && new Date(date))
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

const OutlierDetection = () => {
    const sidebar = useSidebar()
    const [loading, setLoading] = useState(false)
    const [tableVisible, setTableVisible] = useState(false)
    const [elements, setElements] = useState([])
    const [csvQueryStr, setCsvQueryStr] = useState(null)
    const { d2 } = useD2()
    const {
        organisationUnitIds,
        handleOrganisationUnitChange,
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
    } = useFormState()
    const noValuesFoundAlert = useAlert(i18n.t('No values found'), {
        success: true,
    })
    const successfulMarkAlert = useAlert(
        ({ marked }) =>
            marked
                ? i18n.t('Marked for follow-up')
                : i18n.t('Unmarked for follow-up'),
        { success: true, duration: 2e3 }
    )
    const errorAlert = useAlert(
        ({ error }) =>
            error?.message ||
            i18n.t('An unexpected error happened during analysis'),
        { critical: true }
    )

    const showForm = () => {
        setTableVisible(false)
        setCsvQueryStr(null)
        sidebar.show()
    }
    const showTable = () => {
        setTableVisible(true)
        sidebar.hide()
    }

    const createQueryString = () => {
        const querySegments = [
            ...dataSetIds.map(id => `ds=${id}`),
            ...organisationUnitIds.map(id => `ou=${id}`),
            `startDate=${convertDateToApiDateFormat(startDate)}`,
            `endDate=${convertDateToApiDateFormat(endDate)}`,
            `algorithm=${algorithm}`,
            `maxResults=${maxResults}`,
            `orderBy=${orderBy}`,
        ]

        if (algorithm === Z_SCORE) {
            querySegments.push(`threshold=${threshold}`)

            if (dataStartDate) {
                querySegments.push(
                    `dataStartDate=${convertDateToApiDateFormat(dataStartDate)}`
                )
            }

            if (dataEndDate) {
                querySegments.push(
                    `dataEndDate=${convertDateToApiDateFormat(dataEndDate)}`
                )
            }
        }

        return querySegments.join('&')
    }
    const handleStart = async () => {
        const api = d2.Api.getApi()

        const endpoint = apiConf.endpoints.outlierDetection
        const csvQueryStr = createQueryString()

        setLoading(true)
        try {
            const response = await api.get(`${endpoint}?${csvQueryStr}`)
            const elements = response.outlierValues.map(
                convertElementFromApiResponse
            )
            setElements(elements)
            setCsvQueryStr(csvQueryStr)
            if (elements.length > 0) {
                showTable()
            } else {
                noValuesFoundAlert.show()
            }
        } catch (error) {
            errorAlert.show({ error })
        }
        setLoading(false)
    }
    const handleToggleCheckbox = async element => {
        const currentElement = elements.find(({ key }) => key === element.key)
        // TODO: Verify that this check is needed
        if (!currentElement) {
            return
        }

        const api = d2.Api.getApi()
        try {
            await api.update(
                apiConf.endpoints.markOutlierDataValue,
                convertElementToToggleFollowupRequest(currentElement)
            )
            const newMarked = !element.marked
            setElements(
                elements.map(e => {
                    if (e.key === element.key) {
                        return {
                            ...e,
                            marked: newMarked,
                        }
                    } else {
                        return e
                    }
                })
            )
            successfulMarkAlert.show({ marked: newMarked })
        } catch (error) {
            errorAlert.show({ error })
        }
    }

    const formValid = !!(
        startDate &&
        endDate &&
        organisationUnitIds.length > 0 &&
        threshold &&
        dataSetIds.length > 0
    )
    const shouldShowMaxResultsAlertBar =
        tableVisible && elements.length >= apiConf.results.analysis.limit

    return (
        <div>
            <PageHeader
                title={i18n.t('Outlier Detection')}
                onBack={tableVisible ? showForm : null}
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
                        onSubmit={handleStart}
                        valid={formValid}
                        loading={loading}
                        onOrganisationUnitChange={handleOrganisationUnitChange}
                        startDate={startDate}
                        onStartDateChange={handleStartDateChange}
                        endDate={endDate}
                        onEndDateChange={handleEndDateChange}
                        algorithm={algorithm}
                        onAlgorithmChange={handleAlgorithmChange}
                        showAdvancedZScoreFields={showAdvancedZScoreFields}
                        onToggleAdvancedZScoreFields={
                            handleToggleAdvancedZScoreFields
                        }
                        threshold={threshold}
                        onThresholdChange={handleThresholdChange}
                        orderBy={orderBy}
                        onOrderByChange={handleOrderByChange}
                        dataStartDate={dataStartDate}
                        onDataStartDateChange={handleDataStartDateChange}
                        dataEndDate={dataEndDate}
                        onDataEndDateChange={handleDataEndDateChange}
                        dataSetIds={dataSetIds}
                        onDataSetsOnChange={handleDataSetsChange}
                        maxResults={maxResults}
                        onMaxResultsChange={handleMaxResultsChange}
                    />
                </div>
                {tableVisible && csvQueryStr && (
                    <OutlierAnalyisTable
                        algorithm={algorithm}
                        csvQueryStr={csvQueryStr}
                        elements={elements}
                        onToggleCheckbox={handleToggleCheckbox}
                    />
                )}
            </Card>
        </div>
    )
}

export default OutlierDetection
