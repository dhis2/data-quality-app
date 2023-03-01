import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import queryString from 'query-string'
import React, { useState } from 'react'
import MaxResultsAlertBar from '../../components/MaxResultsAlertBar/MaxResultsAlertBar.js'
import PageHeader from '../../components/PageHeader/PageHeader.js'
import { useSidebar } from '../../components/Sidebar/SidebarContext.js'
import { apiConf } from '../../server.conf.js'
import cssPageStyles from '../Page.module.css'
import { Z_SCORE_ALGORITHMS } from './constants.js'
import convertElementFromApiResponse from './convert-element-from-api-response.js'
import Form from './Form/Form.js'
import OutlierAnalyisTable from './OutlierAnalysisTable/OutlierAnalysisTable.js'
import useFormState from './use-form-state.js'

const query = {
    outliers: {
        resource: 'outlierDetection',
        params: (params) => params,
    },
}

const markOutlierMutation = {
    resource: '/dataValues/followup',
    type: 'update',
    data: (data) => data,
}

const OutlierDetection = () => {
    const sidebar = useSidebar()
    const [tableVisible, setTableVisible] = useState(false)
    const [elements, setElements] = useState([])
    const [csvQueryStr, setCsvQueryStr] = useState(null)
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
    const { loading, refetch: fetchOutliers } = useDataQuery(query, {
        lazy: true,
        onComplete: (data) => {
            const elements = data.outliers.outlierValues.map(
                convertElementFromApiResponse
            )
            setElements(elements)
            if (elements.length > 0) {
                showTable()
            } else {
                noValuesFoundAlert.show()
            }
        },
        onError: (error) => {
            errorAlert.show({ error })
        },
    })
    const [markOutlier] = useDataMutation(markOutlierMutation, {
        onError: (error) => {
            errorAlert.show({ error })
        },
    })

    const showForm = () => {
        setTableVisible(false)
        setCsvQueryStr(null)
        sidebar.show()
    }
    const showTable = () => {
        setTableVisible(true)
        sidebar.hide()
    }

    const handleStart = () => {
        const params = {
            ds: dataSetIds,
            ou: organisationUnitIds,
            startDate,
            endDate,
            algorithm,
            maxResults,
            orderBy,
            dataStartDate: null, // needed to clear previous values
            dataEndDate: null,
        }
        if (Z_SCORE_ALGORITHMS.has(algorithm)) {
            params.threshold = threshold
            if (dataStartDate) {
                console.log('has startDate', dataStartDate)
                params.dataStartDate = dataStartDate
            }
            if (dataEndDate) {
                params.dataEndDate = dataEndDate
            }
        }
        fetchOutliers(params)
        setCsvQueryStr(queryString.stringify(params))
    }
    const handleToggleCheckbox = async (element) => {
        const currentElement = elements.find(({ key }) => key === element.key)

        await markOutlier({
            dataElement: currentElement.de,
            period: currentElement.pe,
            orgUnit: currentElement.ou,
            categoryOptionCombo: currentElement.coc || null,
            attributeOptionCombo: currentElement.aoc || null,
            followup: !currentElement.marked,
        })

        const newMarked = !element.marked
        setElements(
            elements.map((e) => {
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
