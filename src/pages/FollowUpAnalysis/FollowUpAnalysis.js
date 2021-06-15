import { useAlert } from '@dhis2/app-runtime'
import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import i18n from '@dhis2/d2-i18n'
import { PropTypes } from '@dhis2/prop-types'
import { Card } from '@dhis2/ui'
import React, { useState } from 'react'
import MaxResultsAlertBar from '../../components/MaxResultsAlertBar/MaxResultsAlertBar'
import PageHeader from '../../components/PageHeader/PageHeader'
import { useSidebar } from '../../components/Sidebar/SidebarContext'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'
import { apiConf } from '../../server.conf'
import cssPageStyles from '../Page.module.css'
import FollowUpAnalysisTable from './FollowUpAnalysisTable/FollowUpAnalysisTable'
import Form from './Form'

const generateElementKey = e =>
    `${e.attributeOptionComboId}-${e.categoryOptionComboId}-${e.periodId}-${e.sourceId}-${e.dataElementId}`

const convertElementFromApiResponse = e => ({
    key: generateElementKey(e),
    attributeOptionComboId: e.attributeOptionComboId,
    categoryOptionComboId: e.categoryOptionComboId,
    periodId: e.periodId,
    organisationUnitId: e.sourceId,
    dataElementId: e.dataElementId,
    dataElement: e.dataElementName,
    organisation: e.sourceName,
    period: e.period.name,
    min: e.min,
    max: e.max,
    value: Number.parseFloat(e.value, 10),
    marked: !e.followup,
    comment: e.comment,
})

const convertElementToUnFollowupRequest = e => ({
    dataElementId: e.dataElementId,
    periodId: e.periodId,
    organisationUnitId: e.organisationUnitId,
    categoryOptionComboId: e.categoryOptionComboId,
    attributeOptionComboId: e.attributeOptionComboId,
    followup: false,
})

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

const FollowUpAnalysis = ({ sectionKey }) => {
    const sidebar = useSidebar()
    const [loading, setLoading] = useState(false)
    const [tableVisible, setTableVisible] = useState(false)
    const [elements, setElements] = useState([])
    const { d2 } = useD2()
    const {
        startDate,
        handleStartDateChange,
        endDate,
        handleEndDateChange,
        organisationUnitId,
        handleOrganisationUnitChange,
        dataSetIds,
        handleDataSetsChange,
    } = useFormState()
    const noValuesFoundAlert = useAlert(i18n.t('No values found'), {
        success: true,
    })
    const successfulUnfollowAlert = useAlert(i18n.t('Elements unfollowed'), {
        success: true,
        duration: 2000,
    })
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

    const handleGetFollowUpList = async () => {
        const api = d2.Api.getApi()

        setLoading(true)
        try {
            const response = await api.post(apiConf.endpoints.folloupAnalysis, {
                startDate: convertDateToApiDateFormat(startDate),
                endDate: convertDateToApiDateFormat(endDate),
                ou: organisationUnitId,
                ds: dataSetIds,
            })
            const elements = response.map(convertElementFromApiResponse)
            setElements(elements)
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
    const handleUnfollow = async () => {
        const api = d2.Api.getApi()

        setLoading(true)
        try {
            const unfollowups = elements.filter(element => element.marked)
            await api.post(apiConf.endpoints.markFollowUpDataValue, {
                followups: unfollowups.map(convertElementToUnFollowupRequest),
            })
            setElements(
                elements.filter(element => !unfollowups.includes(element))
            )
            successfulUnfollowAlert.show()
        } catch (error) {
            errorAlert.show({ error })
        }
        setLoading(false)
    }
    const handleCheckboxToggle = elementKey => {
        setElements(
            elements.map(e => {
                if (e.key === elementKey) {
                    return {
                        ...e,
                        marked: !e.marked,
                    }
                }
                return e
            })
        )
    }

    const formValid =
        startDate && endDate && organisationUnitId && dataSetIds.length > 0
    const shouldShowMaxResultsAlertBar =
        tableVisible && elements.length >= apiConf.results.analysis.limit

    return (
        <div>
            <PageHeader
                title={i18n.t('Follow-Up Analysis')}
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
                        onSubmit={handleGetFollowUpList}
                        valid={formValid}
                        loading={loading}
                        dataSetIds={dataSetIds}
                        onDataSetsChange={handleDataSetsChange}
                        onOrganisationUnitChange={handleOrganisationUnitChange}
                        startDate={startDate}
                        onStartDateChange={handleStartDateChange}
                        endDate={endDate}
                        onEndDateChange={handleEndDateChange}
                    />
                </div>
                {tableVisible && (
                    <FollowUpAnalysisTable
                        elements={elements}
                        onCheckboxToggle={handleCheckboxToggle}
                        onUnfollow={handleUnfollow}
                        loading={loading}
                    />
                )}
            </Card>
        </div>
    )
}

FollowUpAnalysis.propTypes = {
    sectionKey: PropTypes.string.isRequired,
}

export default FollowUpAnalysis
