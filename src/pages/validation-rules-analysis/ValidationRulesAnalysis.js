import i18n from '@dhis2/d2-i18n'
import { Card } from '@dhis2/ui'
import { FontIcon, IconButton } from 'material-ui'
import React from 'react'
import AlertBar from '../../components/alert-bar/AlertBar'
import PageHelper from '../../components/page-helper/PageHelper'
import { ALL_VALIDATION_RULE_GROUPS_ID } from '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect'
import { convertDateToApiDateFormat } from '../../helpers/dates'
import threeMonthsAgo from '../../helpers/threeMonthsAgo'
import { apiConf } from '../../server.conf'
import Page from '../Page'
import cssPageStyles from '../Page.module.css'
import { getDocsKeyForSection } from '../sections.conf'
import Form from './Form'
import ValidationRulesAnalysisTable from './validation-rules-analysis-table/ValidationRulesAnalysisTable'

class ValidationRulesAnalysis extends Page {
    static STATE_PROPERTIES = ['loading', 'elements', 'showTable']

    constructor() {
        super()

        this.state = {
            showTable: false,
            startDate: threeMonthsAgo(),
            endDate: new Date(),
            organisationUnitId: null,
            validationRuleGroupId: ALL_VALIDATION_RULE_GROUPS_ID,
            sendNotfications: false,
            persistNewResults: false,
            elements: [],
            loading: false,
        }
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

    validate = async () => {
        if (!this.isFormValid()) {
            return
        }

        const request = {
            startDate: convertDateToApiDateFormat(this.state.startDate),
            endDate: convertDateToApiDateFormat(this.state.endDate),
            ou: this.state.organisationUnitId,
            notification: this.state.sendNotfications,
            persist: this.state.persistNewResults,
        }
        if (
            this.state.validationRuleGroupId !== ALL_VALIDATION_RULE_GROUPS_ID
        ) {
            request.vrg = this.state.validationRuleGroupId
        }

        this.context.updateAppState({
            pageState: {
                loading: true,
            },
        })

        const api = this.context.d2.Api.getApi()
        const response = await api.post(
            apiConf.endpoints.validationRulesAnalysis,
            { ...request }
        )
        if (!this.isPageMounted()) {
            return
        }

        const elements = response.map(
            ValidationRulesAnalysis.convertElementFromApiResponse
        )
        this.context.updateAppState({
            pageState: {
                loading: false,
                elements,
                showTable: elements.length > 0,
            },
        })
        return elements.length === 0 ? 'VALIDATION_PASSED' : null
    }

    back = () => {
        this.setState({ showTable: false })
        this.context.updateAppState({
            pageState: { showTable: false },
        })
    }

    handleStartDateChange = (event, date) => {
        this.setState({ startDate: new Date(date) })
    }

    handleEndDateChange = (event, date) => {
        this.setState({ endDate: new Date(date) })
    }

    handleOrganisationUnitChange = organisationUnitId => {
        this.setState({ organisationUnitId })
    }

    handleValidationRuleGroupChange = (event, index, value) => {
        this.setState({ validationRuleGroupId: value })
    }

    handleSendNotificationsChange = ({ checked }) => {
        this.setState({ sendNotfications: checked })
    }

    handlePersistNewResultsChange = ({ checked }) => {
        this.setState({ persistNewResults: checked })
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
                <Card className={cssPageStyles.card}>
                    {!this.state.showTable && (
                        <Form
                            onSubmit={this.validate}
                            submitDisabled={this.isActionDisabled()}
                            onOrganisationUnitChange={
                                this.handleOrganisationUnitChange
                            }
                            startDate={this.state.startDate}
                            onStartDateChange={this.handleStartDateChange}
                            endDate={this.state.endDate}
                            onEndDateChange={this.handleEndDateChange}
                            onValidationRuleGroupChange={
                                this.handleValidationRuleGroupChange
                            }
                            sendNotfications={this.state.sendNotfications}
                            onSendNotificationsChange={
                                this.handleSendNotificationsChange
                            }
                            persistNewResults={this.state.persistNewResults}
                            onPersistNewResultsChange={
                                this.handlePersistNewResultsChange
                            }
                        />
                    )}
                    {this.state.showTable && (
                        <ValidationRulesAnalysisTable
                            elements={this.state.elements}
                        />
                    )}
                </Card>
            </div>
        )
    }
}

export default ValidationRulesAnalysis
