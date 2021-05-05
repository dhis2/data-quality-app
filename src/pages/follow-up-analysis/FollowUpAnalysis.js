import i18n from '@dhis2/d2-i18n'
import { Card, Button } from '@dhis2/ui'
import { FontIcon } from 'material-ui'
import React from 'react'
import AlertBar from '../../components/alert-bar/AlertBar'
import PageHelper from '../../components/page-helper/PageHelper'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'
import { apiConf } from '../../server.conf'
import Page from '../Page'
import pageStyles from '../Page.module.css'
import { getDocsKeyForSection } from '../sections.conf'
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable'
import Form from './Form'

const convertElementFromApiResponse = e => ({
    key: `${e.aoc}-${e.coc}-${e.pe}-${e.ou}-${e.de}`,
    attributeOptionComboId: e.aoc,
    categoryOptionComboId: e.coc,
    periodId: e.pe,
    period: e.pe,
    organisationUnitId: e.ou,
    organisation: e.ouName,
    dataElementId: e.de,
    dataElement: e.deName,
    min: e.min,
    max: e.max,
    value: Number.parseFloat(e.value, 10),
    comment: e.comment,
    marked: false,
})

class FollowUpAnalysis extends Page {
    static STATE_PROPERTIES = [
        'showTable',
        'startDate',
        'endDate',
        'organisationUnitId',
        'dataSetIds',
        'elements',
        'loading',
    ]

    constructor() {
        super()

        this.state = {
            showTable: false,
            startDate: threeMonthsAgo(),
            endDate: new Date(),
            organisationUnitId: null,
            dataSetIds: [],
            elements: [],
            loading: false,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (FollowUpAnalysis.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property]
            }
        })

        this.setState(nextState)
    }

    getFollowUpList = async () => {
        this.context.updateAppState({
            pageState: {
                loading: true,
            },
        })

        const api = this.context.d2.Api.getApi()
        const request = {
            startDate: convertDateToApiDateFormat(this.state.startDate),
            endDate: convertDateToApiDateFormat(this.state.endDate),
            ou: this.state.organisationUnitId,
            ds: this.state.dataSetIds,
        }
        const response = await api.get(
            apiConf.endpoints.followupAnalysis,
            request
        )
        if (!this.isPageMounted()) {
            return
        }

        const elements = response.followupValues.map(
            convertElementFromApiResponse
        )

        this.context.updateAppState({
            pageState: {
                loading: false,
                elements,
                showTable: elements && elements.length > 0,
            },
        })
        return elements.length === 0 ? 'NO_VALUES_FOUND' : null
    }

    back = () => {
        this.setState({ showTable: false })
        this.context.updateAppState({
            pageState: { showTable: false },
        })
    }

    startDateOnChange = (event, date) => {
        this.setState({ startDate: new Date(date) })
    }

    endDateOnChange = (event, date) => {
        this.setState({ endDate: new Date(date) })
    }

    handleOrganisationUnitChange = organisationUnitId => {
        this.setState({ organisationUnitId })
    }

    handleDataSetsChange = ({ selected }) => {
        this.setState({ dataSetIds: selected })
    }

    handleCheckboxToggle = element => {
        this.setState({
            elements: this.state.elements.map(e => {
                if (e.key === element.key) {
                    return {
                        ...e,
                        marked: !e.marked,
                    }
                }
                return e
            }),
        })
    }

    handleBatchUnfollow = async unfollowups => {
        this.context.updateAppState({
            pageState: {
                loading: true,
            },
        })

        const api = this.context.d2.Api.getApi()
        await api.update(apiConf.endpoints.markFollowups, {
            values: unfollowups,
        })
        if (!this.isPageMounted()) {
            return
        }

        // remove unfollowed elements
        const elements = this.state.elements.filter(
            element =>
                !unfollowups.some(unfollow => element.key === unfollow.key)
        )
        this.context.updateAppState({
            pageState: {
                loading: false,
                elements,
            },
        })
    }

    isFormValid() {
        return (
            this.state.startDate &&
            this.state.endDate &&
            this.state.organisationUnitId &&
            this.state.dataSetIds &&
            this.state.dataSetIds.length > 0
        )
    }

    isActionDisabled() {
        return !this.isFormValid() || this.state.loading
    }

    showAlertBar() {
        return (
            this.state.showTable &&
            this.state.elements &&
            this.state.elements.length >= apiConf.results.analysis.limit
        )
    }

    render() {
        return (
            <div>
                <header className={pageStyles.pageHeader}>
                    {this.state.showTable && (
                        <Button
                            small
                            secondary
                            icon={
                                <FontIcon className={'material-icons'}>
                                    arrow_back
                                </FontIcon>
                            }
                            onClick={this.back}
                            className={pageStyles.tableBackButton}
                        />
                    )}
                    <h1>{i18n.t('Follow-Up Analysis')}</h1>
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </header>
                <AlertBar show={this.showAlertBar()} />
                <Card className={pageStyles.card}>
                    {/* Hide form instead of not rendering to preserve org unit state */}
                    <div
                        style={{
                            display: this.state.showTable ? 'none' : 'block',
                        }}
                    >
                        <Form
                            onSubmit={this.getFollowUpList}
                            submitDisabled={this.isActionDisabled()}
                            dataSetIds={this.state.dataSetIds}
                            onDataSetsChange={this.handleDataSetsChange}
                            onOrganisationUnitChange={
                                this.handleOrganisationUnitChange
                            }
                            startDate={this.state.startDate}
                            onStartDateChange={this.startDateOnChange}
                            endDate={this.state.endDate}
                            onEndDateChange={this.endDateOnChange}
                        />
                    </div>
                    {this.state.showTable && (
                        <FollowUpAnalysisTable
                            elements={this.state.elements}
                            loading={this.state.loading}
                            onCheckboxToggle={this.handleCheckboxToggle}
                            onBatchUnfollow={this.handleBatchUnfollow}
                        />
                    )}
                </Card>
            </div>
        )
    }
}

export default FollowUpAnalysis
