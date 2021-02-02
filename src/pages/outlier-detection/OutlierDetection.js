import React from 'react'
import { Card, CardText } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import DatePicker from 'material-ui/DatePicker'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import FlatButton from 'material-ui/FlatButton'
import { FontIcon, IconButton } from 'material-ui'
import { SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import classNames from 'classnames'
import Page from '../Page'
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect'
import AvailableOrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree'
import PageHelper from '../../components/page-helper/PageHelper'
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable'
import AlertBar from '../../components/alert-bar/AlertBar'
import i18n from '@dhis2/d2-i18n'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import { getDocsKeyForSection } from '../sections.conf'
import { apiConf } from '../../server.conf'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles'

export const Z_SCORE = 'Z_SCORE'
export const DEFAULT_THRESHOLD = 3.0
export const DEFAULT_ALGORITHM = Z_SCORE
export const DEFAULT_MAX_RESULTS = 500
export const DEFAULT_SORT_BY = Z_SCORE

const threeMonthsAgo = () => {
    const date = new Date()
    date.setMonth(date.getMonth() - 3)
    return date
}

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

        this.start = this.start.bind(this)
        this.back = this.back.bind(this)

        this.startDateOnChange = this.startDateOnChange.bind(this)
        this.endDateOnChange = this.endDateOnChange.bind(this)
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this)
        this.dataSetsOnChange = this.dataSetsOnChange.bind(this)
        this.thresholdOnChange = this.thresholdOnChange.bind(this)
        this.algorithmOnChange = this.algorithmOnChange.bind(this)
        this.dataStartDateOnChange = this.dataStartDateOnChange.bind(this)
        this.dataEndDateOnChange = this.dataEndDateOnChange.bind(this)
        this.maxResultsOnChange = this.maxResultsOnChange.bind(this)
        this.sortByOnChange = this.sortByOnChange.bind(this)

        this.toggleShowAdvancedZScoreFields = this.toggleShowAdvancedZScoreFields.bind(
            this
        )
        this.toggleCheckbox = this.toggleCheckbox.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (
                nextProps.hasOwnProperty(property) &&
                OutlierDetection.STATE_PROPERTIES.includes(property)
            ) {
                nextState[property] = nextProps[property]
            }
        })

        if (nextState !== {}) {
            this.setState(nextState)
        }
    }

    start() {
        const api = this.context.d2.Api.getApi()
        if (this.isFormValid()) {
            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            })

            const endpoint = apiConf.endpoints.outlierDetection
            const csvQueryStr = this.createQueryString()

            api.get(`${endpoint}?${csvQueryStr}`)
                .then(response => {
                    if (this.isPageMounted()) {
                        const elements = response.outlierValues.map(
                            OutlierAnalyisTable.convertElementFromApiResponse
                        )

                        const feedback =
                            elements && elements.length > 0
                                ? {
                                      showSnackbar: false,
                                  }
                                : {
                                      showSnackbar: true,
                                      snackbarConf: {
                                          type: SUCCESS,
                                          message: i18n.t('No values found'),
                                      },
                                  }

                        this.context.updateAppState({
                            ...feedback,
                            pageState: {
                                loading: false,
                                elements,
                                showTable: elements && elements.length > 0,
                                csvQueryStr,
                            },
                        })
                    }
                })
                .catch(error => {
                    this.manageError(error)
                })
        }
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

    back() {
        this.setState({ showTable: false, csvQueryStr: null })
        this.context.updateAppState({
            pageState: { showTable: false },
        })
    }

    startDateOnChange(event, date) {
        this.setState({ startDate: new Date(date) })
    }

    endDateOnChange(event, date) {
        this.setState({ endDate: new Date(date) })
    }

    dataStartDateOnChange(event, date) {
        this.setState({ dataStartDate: new Date(date) })
    }

    dataEndDateOnChange(event, date) {
        this.setState({ dataEndDate: new Date(date) })
    }

    maxResultsOnChange(event, index, value) {
        this.setState({ maxResults: value })
    }

    sortByOnChange(event, index, value) {
        this.setState({ sortBy: value })
    }

    toggleShowAdvancedZScoreFields(event, index, value) {
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

    organisationUnitOnChange(organisationUnitIds) {
        this.setState({ organisationUnitIds })
    }

    dataSetsOnChange(event) {
        const dataSetIds = []
        const selectedOptions = event.target.selectedOptions
        for (let i = 0; i < selectedOptions.length; i++) {
            dataSetIds.push(selectedOptions[i].value)
        }
        this.setState({ dataSetIds })
    }

    thresholdOnChange(event, index, value) {
        this.setState({ threshold: value })
    }

    algorithmOnChange(event, index, value) {
        this.setState({ algorithm: value })
    }

    toggleCheckbox(element) {
        const api = this.context.d2.Api.getApi()
        const elements = this.state.elements
        for (let i = 0; i < elements.length; i++) {
            const currentElement = elements[i]
            if (currentElement.key === element.key) {
                this.context.updateAppState({
                    pageState: {
                        loading: true,
                        elements,
                        showTable: elements && elements.length > 0,
                    },
                })
                const data = OutlierAnalyisTable.convertElementToToggleFollowupRequest(
                    currentElement
                )
                api.update(apiConf.endpoints.markDataValue, data)
                    .then(() => {
                        if (this.isPageMounted()) {
                            currentElement.marked = !currentElement.marked
                            elements[i] = currentElement

                            this.context.updateAppState({
                                showSnackbar: true,
                                snackbarConf: {
                                    type: SUCCESS,
                                    message: i18n.t(
                                        currentElement.marked
                                            ? 'Marked'
                                            : 'Unmarked'
                                    ),
                                },
                                pageState: {
                                    elements,
                                    loading: false,
                                    showTable: elements && elements.length > 0,
                                },
                            })
                        }
                    })
                    .catch(error => {
                        this.manageError(error)
                    })
                break
            }
        }
    }

    isFormValid() {
        return (
            this.state.startDate &&
            this.state.endDate &&
            this.state.organisationUnitIds &&
            this.state.organisationUnitIds.length > 0 &&
            this.state.threshold &&
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

    renderThresholdField() {
        return (
            <SelectField
                id="threshold"
                style={jsPageStyles.inputForm}
                floatingLabelText={i18n.t('Threshold')}
                onChange={this.thresholdOnChange}
                value={this.state.threshold}
            >
                <MenuItem value={1.0} primaryText="1.0" />
                <MenuItem value={1.5} primaryText="1.5" />
                <MenuItem value={2.0} primaryText="2.0" />
                <MenuItem value={2.5} primaryText="2.5" />
                <MenuItem value={3} primaryText="3.0" />
                <MenuItem value={3.5} primaryText="3.5" />
                <MenuItem value={4} primaryText="4.0" />
                <MenuItem value={4.5} primaryText="4.5" />
                <MenuItem value={5} primaryText="5.0" />
            </SelectField>
        )
    }

    renderZScoreFields() {
        const { showAdvancedZScoreFields } = this.state
        const buttonLabel = showAdvancedZScoreFields
            ? i18n.t('Hide advanced fields')
            : i18n.t('Show advanced fields')

        return (
            <>
                <FlatButton
                    fullWidth
                    label={buttonLabel}
                    onClick={this.toggleShowAdvancedZScoreFields}
                    style={{ marginTop: '12px' }}
                />
                {showAdvancedZScoreFields && (
                    <>
                        <DatePicker
                            id="data-start-date"
                            textFieldStyle={jsPageStyles.inputForm}
                            floatingLabelText={i18n.t('Data Start Date')}
                            onChange={this.dataStartDateOnChange}
                            maxDate={this.state.dataEndDate}
                            value={this.state.dataStartDate}
                        />
                        <DatePicker
                            id="data-end-date"
                            textFieldStyle={jsPageStyles.inputForm}
                            floatingLabelText={i18n.t('Data End Date')}
                            onChange={this.dataEndDateOnChange}
                            minDate={this.state.dataStartDate}
                            value={this.state.dataEndDate}
                        />
                        <SelectField
                            id="sort-by"
                            style={jsPageStyles.inputForm}
                            floatingLabelText={i18n.t('Sort by')}
                            onChange={this.sortByOnChange}
                            value={this.state.sortBy}
                        >
                            <MenuItem value={Z_SCORE} primaryText="Z-score" />
                            <MenuItem
                                value="MEAN_ABS_DEV"
                                primaryText="Absolute Deviation from Mean"
                            />
                        </SelectField>
                    </>
                )}
            </>
        )
    }

    render() {
        return (
            <div>
                <h1 className={cssPageStyles.pageHeader}>
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
                    {i18n.t('Outlier Detection')}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </h1>
                <AlertBar show={this.showAlertBar()} />
                <Card>
                    {/* FORM: hidden using style to avoid not needed api requests when going back from table */}
                    <CardText
                        style={{
                            display: !this.state.showTable ? 'block' : 'none',
                        }}
                    >
                        <div className="row">
                            <div
                                id="data-sets-container"
                                className={classNames(
                                    'col-md-4',
                                    cssPageStyles.section
                                )}
                            >
                                <div className={cssPageStyles.formLabel}>
                                    {i18n.t('Data Set')}
                                </div>
                                <AvailableDatasetsSelect
                                    onChange={this.dataSetsOnChange}
                                />
                            </div>
                            <div
                                className={classNames(
                                    'col-md-4',
                                    cssPageStyles.section
                                )}
                            >
                                <div className={cssPageStyles.formLabel}>
                                    {i18n.t('Organisation units')}
                                </div>
                                <AvailableOrganisationUnitsTree
                                    multiselect
                                    onChange={this.organisationUnitOnChange}
                                />
                            </div>
                            <div
                                className={classNames(
                                    'col-md-4',
                                    cssPageStyles.section
                                )}
                            >
                                <DatePicker
                                    id="start-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={i18n.t('Start Date')}
                                    onChange={this.startDateOnChange}
                                    defaultDate={new Date()}
                                    maxDate={this.state.endDate}
                                    value={this.state.startDate}
                                />
                                <DatePicker
                                    id="end-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={i18n.t('End Date')}
                                    onChange={this.endDateOnChange}
                                    defaultDate={new Date()}
                                    minDate={this.state.startDate}
                                    value={this.state.endDate}
                                />
                                <SelectField
                                    id="algorithm"
                                    style={jsPageStyles.inputForm}
                                    floatingLabelText={i18n.t('Algorithm')}
                                    onChange={this.algorithmOnChange}
                                    value={this.state.algorithm}
                                >
                                    <MenuItem
                                        value={Z_SCORE}
                                        primaryText="Z-score"
                                    />
                                    <MenuItem
                                        value="MIN_MAX"
                                        primaryText="Min-max values"
                                    />
                                </SelectField>
                                {this.state.algorithm === Z_SCORE &&
                                    this.renderThresholdField()}
                                <SelectField
                                    id="max-results"
                                    style={jsPageStyles.inputForm}
                                    floatingLabelText={i18n.t('Max results')}
                                    onChange={this.maxResultsOnChange}
                                    value={this.state.maxResults}
                                >
                                    <MenuItem value={100} primaryText="100" />
                                    <MenuItem value={200} primaryText="200" />
                                    <MenuItem value={500} primaryText="500" />
                                </SelectField>
                                {this.state.algorithm === Z_SCORE &&
                                    this.renderZScoreFields()}
                            </div>
                        </div>
                        <RaisedButton
                            id="start-analysis-button"
                            className={cssPageStyles.mainButton}
                            primary
                            label={i18n.t('start')}
                            onClick={this.start}
                            disabled={this.isActionDisabled()}
                        />
                    </CardText>
                    {/* TABLE */}
                    {this.state.showTable && this.state.csvQueryStr && (
                        <CardText id="results-table">
                            <OutlierAnalyisTable
                                algorithm={this.state.algorithm}
                                csvQueryStr={this.state.csvQueryStr}
                                elements={this.state.elements}
                                toggleCheckbox={this.toggleCheckbox}
                            />
                        </CardText>
                    )}
                </Card>
            </div>
        )
    }
}

export default OutlierDetection
