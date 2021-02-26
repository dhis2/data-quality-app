import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import { SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { FontIcon, IconButton } from 'material-ui'
import React from 'react'
import AlertBar from '../../components/alert-bar/AlertBar'
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable'
import PageHelper from '../../components/page-helper/PageHelper'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import { apiConf } from '../../server.conf'
import Page from '../Page'
import cssPageStyles from '../Page.module.css'
import { getDocsKeyForSection } from '../sections.conf'
import {
    Z_SCORE,
    DEFAULT_THRESHOLD,
    DEFAULT_ALGORITHM,
    DEFAULT_MAX_RESULTS,
    DEFAULT_SORT_BY,
} from './constants'
import Form from './Form'
import styles from './OutlierDetection.module.css'

class OutlierDetection extends Page {
    static STATE_PROPERTIES = [
        'showTable',
        'startDate',
        'endDate',
        'organisationUnitIds',
        'dataSetIds',
        'elements',
        'threshold',
        'loading',
        'csvQueryStr',
        'showAdvancedZScoreFields',
        'dataStartDate',
        'dataEndDate',
        'maxResults',
        'sortBy',
    ]

    constructor() {
        super()

        const threeMonthsAgo = () => {
            const date = new Date()
            date.setMonth(date.getMonth() - 3)
            return date
        }

        this.state = {
            showTable: false,
            startDate: threeMonthsAgo(),
            endDate: new Date(),
            organisationUnitIds: [],
            dataSetIds: [],
            elements: [],
            algorithm: DEFAULT_ALGORITHM,
            threshold: DEFAULT_THRESHOLD,
            csvQueryStr: null,
            showAdvancedZScoreFields: false,
            dataStartDate: null,
            dataEndDate: null,
            maxResults: DEFAULT_MAX_RESULTS,
            sortBy: DEFAULT_SORT_BY,
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (OutlierDetection.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property]
            }
        })

        this.setState(nextState)
    }

    start = async () => {
        this.context.updateAppState({
            pageState: {
                loading: true,
            },
        })
        const endpoint = apiConf.endpoints.outlierDetection
        const csvQueryStr = this.createQueryString()
        const api = this.context.d2.Api.getApi()
        const response = await api.get(`${endpoint}?${csvQueryStr}`)
        if (!this.isPageMounted()) {
            return
        }

        const elements = response.outlierValues.map(
            OutlierAnalyisTable.convertElementFromApiResponse
        )
        this.context.updateAppState({
            pageState: {
                loading: false,
                elements,
                showTable: elements && elements.length > 0,
                csvQueryStr,
            },
        })
        return elements.length === 0 ? 'NO_VALUES_FOUND' : null
    }

    createQueryString() {
        const isZScoreAlgorithm = this.state.algorithm === Z_SCORE
        const querySegments = [
            ...this.state.dataSetIds.map(id => `ds=${id}`),
            ...this.state.organisationUnitIds.map(id => `ou=${id}`),
            `startDate=${convertDateToApiDateFormat(this.state.startDate)}`,
            `endDate=${convertDateToApiDateFormat(this.state.endDate)}`,
            `algorithm=${this.state.algorithm}`,
            `maxResults=${this.state.maxResults}`,
            `sortBy=${this.state.sortBy}`,
        ]

        if (isZScoreAlgorithm) {
            querySegments.push(`threshold=${this.state.threshold}`)
        }

        if (isZScoreAlgorithm && this.state.dataStartDate) {
            querySegments.push(
                `dataStartDate=${convertDateToApiDateFormat(
                    this.state.dataStartDate
                )}`
            )
        }

        if (isZScoreAlgorithm && this.state.dataEndDate) {
            querySegments.push(
                `dataEndDate=${convertDateToApiDateFormat(
                    this.state.dataEndDate
                )}`
            )
        }

        return querySegments.join('&')
    }

    back = () => {
        this.setState({ showTable: false, csvQueryStr: null })
        this.context.updateAppState({
            pageState: { showTable: false },
        })
    }

    handleStartDateChange = (event, date) => {
        this.setState({ startDate: new Date(date) })
    }

    handleEndDateOnChange = (event, date) => {
        this.setState({ endDate: new Date(date) })
    }

    handleDataStartDateChange = (event, date) => {
        this.setState({ dataStartDate: new Date(date) })
    }

    handleDataEndDateChange = (event, date) => {
        this.setState({ dataEndDate: new Date(date) })
    }

    handleMaxResultsChange = (event, index, value) => {
        this.setState({ maxResults: value })
    }

    handleSortByChange = (event, index, value) => {
        this.setState({ sortBy: value })
    }

    toggleShowAdvancedZScoreFields = () => {
        const shouldShow = !this.state.showAdvancedZScoreFields
        if (shouldShow) {
            this.setState({
                showAdvancedZScoreFields: true,
            })
        } else {
            this.setState({
                showAdvancedZScoreFields: false,
                // Also reset advanced fields
                dataStartDate: null,
                dataEndDate: null,
                sortBy: DEFAULT_SORT_BY,
            })
        }
    }

    handleOrganisationUnitChange = organisationUnitIds => {
        this.setState({ organisationUnitIds })
    }

    handleDataSetsChange = ({ selected }) => {
        this.setState({ dataSetIds: selected })
    }

    handleThresholdChange = (event, index, value) => {
        this.setState({ threshold: value })
    }

    handleAlgorithmChange = (event, index, value) => {
        this.setState({ algorithm: value })
    }

    toggleCheckbox = async element => {
        const currentElementIndex = this.state.elements.findIndex(
            ({ key }) => key === element.key
        )
        const currentElement = this.state.elements[currentElementIndex]
        if (!currentElement) {
            return
        }

        this.context.updateAppState({
            pageState: {
                loading: true,
                elements: this.state.elements,
                showTable: true,
            },
        })
        const data = OutlierAnalyisTable.convertElementToToggleFollowupRequest(
            currentElement
        )
        const api = this.context.d2.Api.getApi()
        try {
            await api.update(apiConf.endpoints.markDataValue, data)
            if (!this.isPageMounted()) {
                return
            }

            const updatedElement = {
                ...currentElement,
                marked: !currentElement.marked,
            }
            const elements = [
                ...this.state.elements.slice(0, currentElementIndex),
                updatedElement,
                ...this.state.elements.slice(currentElementIndex + 1),
            ]
            // TODO: Replace with `useAlert`
            const getMarkedForFollowUpSuccessMessage = marked =>
                marked
                    ? i18n.t('Marked for follow-up')
                    : i18n.t('Unmarked for follow-up')
            this.context.updateAppState({
                showSnackbar: true,
                snackbarConf: {
                    type: SUCCESS,
                    message: getMarkedForFollowUpSuccessMessage(
                        updatedElement.marked
                    ),
                },
                pageState: {
                    elements,
                    loading: false,
                    showTable: true,
                },
            })
        } catch (error) {
            this.manageError(error)
        }
    }

    isFormValid = () =>
        this.state.startDate &&
        this.state.endDate &&
        this.state.organisationUnitIds &&
        this.state.organisationUnitIds.length > 0 &&
        this.state.threshold &&
        this.state.dataSetIds &&
        this.state.dataSetIds.length > 0

    isActionDisabled = () => !this.isFormValid() || this.state.loading

    showAlertBar = () =>
        this.state.showTable &&
        this.state.elements &&
        this.state.elements.length >= apiConf.results.analysis.limit

    render() {
        return (
            <div>
                <header className={cssPageStyles.pageHeader}>
                    <IconButton
                        onClick={this.back}
                        style={{
                            display: this.state.showTable ? 'inline' : 'none',
                        }}
                    >
                        <FontIcon className={'material-icons'}>
                            arrow_back
                        </FontIcon>
                    </IconButton>
                    <h1>{i18n.t('Outlier Detection')}</h1>
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </header>
                <AlertBar show={this.showAlertBar()} />
                <Card className={styles.card}>
                    {/* FORM: hidden to avoid not needed api requests when going back from table */}
                    {!this.state.showTable && (
                        <Form
                            onSubmit={this.start}
                            submitDisabled={this.isActionDisabled()}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            algorithm={this.state.algorithm}
                            showAdvancedZScoreFields={
                                this.state.showAdvancedZScoreFields
                            }
                            onToggleAdvancedZScoreFields={
                                this.toggleShowAdvancedZScoreFields
                            }
                            onAlgorithmChange={this.handleAlgorithmChange}
                            threshold={this.state.threshold}
                            onThresholdChange={this.handleThresholdChange}
                            sortBy={this.state.sortBy}
                            onSortByChange={this.handleSortByChange}
                            dataStartDate={this.state.dataStartDate}
                            onDataStartDateChange={
                                this.handleDataStartDateChange
                            }
                            onDataEndDateChange={this.handleDataEndDateChange}
                            dataEndDate={this.state.dataEndDate}
                            dataSetIds={this.state.dataSetIds}
                            onDataSetsOnChange={this.handleDataSetsChange}
                            onOrganisationUnitChange={
                                this.handleOrganisationUnitChange
                            }
                            maxResults={this.state.maxResults}
                            onMaxResultsChange={this.handleMaxResultsChange}
                            onStartDateChange={this.handleStartDateChange}
                            onEndDateChange={this.handleEndDateChange}
                        />
                    )}
                    {this.state.showTable && this.state.csvQueryStr && (
                        <OutlierAnalyisTable
                            algorithm={this.state.algorithm}
                            csvQueryStr={this.state.csvQueryStr}
                            elements={this.state.elements}
                            toggleCheckbox={this.toggleCheckbox}
                        />
                    )}
                </Card>
            </div>
        )
    }
}

export default OutlierDetection
