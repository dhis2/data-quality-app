import i18n from '@dhis2/d2-i18n'
import { Button, Checkbox } from '@dhis2/ui'
import { SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes'
import { FontIcon, IconButton } from 'material-ui'
import { Card, CardText } from 'material-ui/Card'
import DatePicker from 'material-ui/DatePicker'
import React from 'react'
import AlertBar from '../../components/alert-bar/AlertBar'
import AvailableOrganisationUnitsTree from '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree'
import PageHelper from '../../components/page-helper/PageHelper'
import ValidationRuleGroupsSelect, {
    ALL_VALIDATION_RULE_GROUPS_ID,
} from '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import { apiConf } from '../../server.conf'
import Page from '../Page'
import cssPageStyles from '../Page.module.css'
import jsPageStyles from '../PageStyles'
import { getDocsKeyForSection } from '../sections.conf'
import ValidationRulesAnalysisTable from './validation-rules-analysis-table/ValidationRulesAnalysisTable'

class ValidationRulesAnalysis extends Page {
    static STATE_PROPERTIES = ['loading', 'elements', 'showTable']

    constructor() {
        super()

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            validationRuleGroupId: ALL_VALIDATION_RULE_GROUPS_ID,
            notification: false,
            persist: false,
            elements: [],
            loading: false,
        }

        this.validate = this.validate.bind(this)
        this.back = this.back.bind(this)

        this.startDateOnChange = this.startDateOnChange.bind(this)
        this.endDateOnChange = this.endDateOnChange.bind(this)
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this)
        this.validationRuleGroupOnChange = this.validationRuleGroupOnChange.bind(
            this
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (ValidationRulesAnalysis.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property]
            }
        })

        this.setState(nextState)
    }

    static generateElementKey = e =>
        `${e.validationRuleId}-${e.periodId}-${e.organisationUnitId}-${e.attributeOptionComboId}`

    static convertElementFromApiResponse = e => ({
        key: ValidationRulesAnalysis.generateElementKey(e),
        validationRuleId: e.validationRuleId,
        attributeOptionCombo: e.attributeOptionComboDisplayName,
        attributeOptionComboId: e.attributeOptionComboId,
        organisation: e.organisationUnitDisplayName,
        organisationUnitId: e.organisationUnitId,
        period: e.periodDisplayName,
        periodId: e.periodId,
        importance: e.importance,
        validationRule: e.validationRuleDescription,
        leftValue: e.leftSideValue,
        operator: e.operator,
        rightValue: e.rightSideValue,
    })

    validate() {
        const api = this.context.d2.Api.getApi()

        if (this.isFormValid()) {
            const request = {
                startDate: convertDateToApiDateFormat(this.state.startDate),
                endDate: convertDateToApiDateFormat(this.state.endDate),
                ou: this.state.organisationUnitId,
                notification: this.state.notification,
                persist: this.state.persist,
            }

            if (
                this.state.validationRuleGroupId !==
                ALL_VALIDATION_RULE_GROUPS_ID
            ) {
                request.vrg = this.state.validationRuleGroupId
            }

            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            })

            api.post(apiConf.endpoints.validationRulesAnalysis, { ...request })
                .then(response => {
                    if (this.isPageMounted()) {
                        const elements = response.map(
                            ValidationRulesAnalysis.convertElementFromApiResponse
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
                                          message: i18n.t(
                                              'Validation passed successfully'
                                          ),
                                      },
                                  }
                        this.context.updateAppState({
                            ...feedback,
                            pageState: {
                                loading: false,
                                elements,
                                showTable: elements && elements.length > 0,
                            },
                        })
                    }
                })
                .catch(() => {
                    this.manageError()
                })
        }
    }

    back() {
        this.setState({ showTable: false })
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

    organisationUnitOnChange(organisationUnitId) {
        this.setState({ organisationUnitId })
    }

    validationRuleGroupOnChange(event, index, value) {
        this.setState({ validationRuleGroupId: value })
    }

    updateSendNotifications = ({ checked }) => {
        this.setState({ notification: checked })
    }

    updatePersistNewResults = ({ checked }) => {
        this.setState({ persist: checked })
    }

    showAlertBar() {
        return (
            this.state.showTable &&
            this.state.elements &&
            this.state.elements.length >= apiConf.results.analysis.limit
        )
    }

    isFormValid() {
        return (
            this.state.startDate &&
            this.state.endDate &&
            this.state.organisationUnitId
        )
    }

    isActionDisabled() {
        return !this.isFormValid() || this.state.loading
    }

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
                    <h1>{i18n.t('Validation Rule Analysis')}</h1>
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(
                            this.props.sectionKey
                        )}
                    />
                </header>
                <AlertBar show={this.showAlertBar()} />
                <Card>
                    <CardText
                        style={{
                            display: !this.state.showTable ? 'block' : 'none',
                        }}
                    >
                        <div className="row">
                            <div className="col-sm-12 col-md-6">
                                <div className={cssPageStyles.formLabel}>
                                    {i18n.t('Parent organisation unit')}
                                </div>
                                <AvailableOrganisationUnitsTree
                                    onChange={this.organisationUnitOnChange}
                                />
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <DatePicker
                                    id="start-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={i18n.t('Start Date')}
                                    onChange={this.startDateOnChange}
                                    value={this.state.startDate}
                                    defaultDate={new Date()}
                                    maxDate={this.state.endDate}
                                />
                                <DatePicker
                                    id="end-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={i18n.t('End Date')}
                                    onChange={this.endDateOnChange}
                                    value={this.state.endDate}
                                    defaultDate={new Date()}
                                    minDate={this.state.startDate}
                                />
                                <div id="validation-rule-groups">
                                    <ValidationRuleGroupsSelect
                                        style={jsPageStyles.inputForm}
                                        onChange={
                                            this.validationRuleGroupOnChange
                                        }
                                    />
                                </div>
                                <div id="send-notifications-option">
                                    <Checkbox
                                        label={i18n.t('Send Notifications')}
                                        checked={this.state.notification}
                                        onChange={this.updateSendNotifications}
                                    />
                                </div>
                                <div id="persist-results-option">
                                    <Checkbox
                                        label={i18n.t('Persist new results')}
                                        checked={this.state.persist}
                                        onChange={this.updatePersistNewResults}
                                    />
                                </div>
                            </div>
                        </div>
                        <Button
                            primary
                            className={cssPageStyles.mainButton}
                            disabled={this.isActionDisabled()}
                            onClick={this.validate}
                        >
                            {i18n.t('Validate')}
                        </Button>
                    </CardText>
                    <CardText
                        id="results-table"
                        style={{
                            display: this.state.showTable ? 'block' : 'none',
                        }}
                    >
                        <ValidationRulesAnalysisTable
                            elements={this.state.elements}
                        />
                    </CardText>
                </Card>
            </div>
        )
    }
}

export default ValidationRulesAnalysis
