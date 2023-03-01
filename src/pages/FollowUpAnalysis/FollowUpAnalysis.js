import { useDataQuery, useDataMutation, useAlert } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import MaxResultsAlertBar from '../../components/MaxResultsAlertBar/MaxResultsAlertBar.js'
import PageHeader from '../../components/PageHeader/PageHeader.js'
import { useSidebar } from '../../components/Sidebar/SidebarContext.js'
import { apiConf } from '../../server.conf.js'
import cssPageStyles from '../Page.module.css'
import convertElementFromApiResponse from './convert-element-from-api-response.js'
import convertElementToUnFollowupRequest from './convert-element-to-un-followup-request.js'
import FollowUpAnalysisTable from './FollowUpAnalysisTable/FollowUpAnalysisTable.js'
import Form from './Form.js'
import useFormState from './use-form-state.js'

const query = {
    followups: {
        resource: 'dataAnalysis/followup',
        params: ({ startDate, endDate, ou, ds }) => ({
            startDate,
            endDate,
            ou,
            ds,
        }),
    },
}

const unfollowMutation = {
    resource: 'dataValues/followups',
    type: 'update',
    data: ({ values }) => ({
        values,
    }),
}

const FollowUpAnalysis = ({ sectionKey }) => {
    const sidebar = useSidebar()
    const [tableVisible, setTableVisible] = useState(false)
    const [elements, setElements] = useState([])
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
    const { loading: loadingFollowUpList, refetch: fetchFollowUpList } =
        useDataQuery(query, {
            lazy: true,
            onComplete: (data) => {
                const elements = data.followups.followupValues.map(
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
    const [unfollow, { loading: loadingUnfollow }] = useDataMutation(
        unfollowMutation,
        {
            onComplete: () => {
                successfulUnfollowAlert.show()
            },
            onError: (error) => {
                errorAlert.show({ error })
            },
        }
    )

    const showForm = () => {
        setTableVisible(false)
        sidebar.show()
    }
    const showTable = () => {
        setTableVisible(true)
        sidebar.hide()
    }

    const handleGetFollowUpList = () => {
        fetchFollowUpList({
            startDate,
            endDate,
            ou: organisationUnitId,
            ds: dataSetIds,
        })
    }
    const handleUnfollow = async () => {
        const unfollowups = elements.filter((element) => element.marked)
        unfollow({
            values: unfollowups.map(convertElementToUnFollowupRequest),
        }).then(() => {
            setElements(
                elements.filter((element) => !unfollowups.includes(element))
            )
        })
    }
    const handleCheckboxToggle = (elementKey) => {
        setElements(
            elements.map((e) => {
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

    const formValid = !!(
        startDate &&
        endDate &&
        organisationUnitId &&
        dataSetIds.length > 0
    )
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
                        loading={loadingFollowUpList}
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
                        loading={loadingUnfollow}
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
