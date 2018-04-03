import React from 'react';
import classNames from 'classnames';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import { FontIcon, IconButton } from 'material-ui';

import { SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import Page from '../Page';
import AlertBar from '../../components/alert-bar/AlertBar';
import ValidationRuleGroupsSelect, {
    ALL_VALIDATION_RULE_GROUPS_ID,
} from
    '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

// styles
import jsPageStyles from '../PageStyles';
import cssPageStyles from '../Page.css';
import ValidationRulesAnalysisTable from './validation-rules-analysis-table/ValidationRulesAnalysisTable';

import { apiConf } from '../../server.conf';
import { convertDateToApiDateFormat } from '../../helpers/dates';

class ValidationRulesAnalysis extends Page {
    static STATE_PROPERTIES = [
        'loading',
        'elements',
        'showTable',
    ];

    constructor() {
        super();

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            validationRuleGroupId: ALL_VALIDATION_RULE_GROUPS_ID,
            sendNotifications: false,
            persistNewResults: false,
            elements: [],
            loading: false,
        };

        this.validate = this.validate.bind(this);
        this.back = this.back.bind(this);

        this.startDateOnChange = this.startDateOnChange.bind(this);
        this.endDateOnChange = this.endDateOnChange.bind(this);
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this);
        this.validationRuleGroupOnChange = this.validationRuleGroupOnChange.bind(this);
        this.updateSendNotifications = this.updateSendNotifications.bind(this);
        this.updatePersistNewResults = this.updatePersistNewResults.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && ValidationRulesAnalysis.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    static generateElementKey = e =>
        `${e.validationRuleId}-${e.periodId}-${e.organisationUnitId}`;

    static convertElementFromApiResponse = e => ({
        key: ValidationRulesAnalysis.generateElementKey(e),
        validationRuleId: e.validationRuleId,
        organisation: e.organisationUnitDisplayName,
        organisationUnitId: e.organisationUnitId,
        period: e.periodDisplayName,
        periodId: e.periodId,
        importance: e.importance,
        validationRule: e.validationRuleDescription,
        leftValue: e.leftSideValue,
        operator: e.operator,
        rightValue: e.rightSideValue,
    });

    validate() {
        const api = this.context.d2.Api.getApi();
        const translator = this.context.translator;

        if (this.isFormValid()) {
            const request = {
                startDate: convertDateToApiDateFormat(this.state.startDate),
                endDate: convertDateToApiDateFormat(this.state.endDate),
                organisationUnitId: this.state.organisationUnitId,
                sendNotifications: this.state.sendNotifications,
                persistNewResults: this.state.persistNewResults,
            };

            if (this.state.validationRuleGroupId !== ALL_VALIDATION_RULE_GROUPS_ID) {
                request.validationRuleGroupId = this.state.validationRuleGroupId;
            }

            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            });

            api.post(apiConf.endpoints.validationRulesAnalysis, { ...request }).then((response) => {
                if (this.isPageMounted()) {
                    const elements = response.map(ValidationRulesAnalysis.convertElementFromApiResponse);
                    const feedback = elements && elements.length > 0 ? {
                        showSnackbar: false,
                    } : {
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: translator(i18nKeys.messages.validationSuccess),
                        },
                    };
                    this.context.updateAppState({
                        ...feedback,
                        pageState: {
                            loading: false,
                            elements,
                            showTable: elements && elements.length > 0,
                        },
                    });
                }
            }).catch(() => { this.manageError(); });
        }
    }

    back() {
        this.setState({ showTable: false });
    }

    startDateOnChange(event, date) {
        this.setState({ startDate: new Date(date) });
    }

    endDateOnChange(event, date) {
        this.setState({ endDate: new Date(date) });
    }

    organisationUnitOnChange(organisationUnitId) {
        this.setState({ organisationUnitId });
    }

    validationRuleGroupOnChange(event, index, value) {
        this.setState({ validationRuleGroupId: value });
    }

    updateSendNotifications(event, checked) {
        this.setState({ sendNotifications: checked });
    }

    updatePersistNewResults(event, checked) {
        this.setState({ persistNewResults: checked });
    }

    showAlertBar() {
        return this.state.showTable &&
            this.state.elements &&
            this.state.elements.length >= apiConf.results.analysis.limit;
    }

    isFormValid() {
        return this.state.startDate &&
            this.state.endDate &&
            this.state.organisationUnitId;
    }

    isActionDisabled() {
        return !this.isFormValid() || this.state.loading;
    }

    render() {
        const translator = this.context.translator;

        return (
            <div>
                <h1 className={cssPageStyles.pageHeader}>
                    <IconButton
                        onClick={this.back}
                        style={{ display: this.state.showTable ? 'inline' : 'none' }}
                    >
                        <FontIcon className={'material-icons'}>
                            arrow_back
                        </FontIcon>
                    </IconButton>
                    {translator(i18nKeys.validationRulesAnalysis.header)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <AlertBar show={this.showAlertBar()} />
                <Card>
                    <CardText style={{ display: !this.state.showTable ? 'block' : 'none' }}>
                        <div className="row">
                            <div className={classNames('col-md-6', cssPageStyles.section)}>
                                <div className={cssPageStyles.formLabel}>
                                    {translator(i18nKeys.validationRulesAnalysis.form.organisationUnit)}
                                </div>
                                <AvailableOrganisationUnitsTree onChange={this.organisationUnitOnChange} />
                            </div>
                            <div className={classNames('col-md-6', cssPageStyles.section)}>
                                <DatePicker
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        translator(i18nKeys.validationRulesAnalysis.form.startDate)
                                    }
                                    onChange={this.startDateOnChange}
                                    value={this.state.startDate}
                                    defaultDate={new Date()}
                                    maxDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        translator(i18nKeys.validationRulesAnalysis.form.endDate)
                                    }
                                    onChange={this.endDateOnChange}
                                    value={this.state.endDate}
                                    defaultDate={new Date()}
                                    maxDate={new Date()}
                                />
                                <ValidationRuleGroupsSelect
                                    style={jsPageStyles.inputForm}
                                    onChange={this.validationRuleGroupOnChange}
                                />
                                <Checkbox
                                    label={translator(i18nKeys.validationRulesAnalysis.form.sendNotifications)}
                                    labelPosition="left"
                                    checked={this.state.sendNotifications}
                                    onCheck={this.updateSendNotifications}
                                />
                                <Checkbox
                                    label={translator(i18nKeys.validationRulesAnalysis.form.persistNewResults)}
                                    labelPosition="left"
                                    checked={this.state.persistNewResults}
                                    onCheck={this.updatePersistNewResults}
                                />
                            </div>
                        </div>
                        <RaisedButton
                            className={cssPageStyles.mainButton}
                            label={translator(i18nKeys.validationRulesAnalysis.actionButton)}
                            primary
                            disabled={this.isActionDisabled()}
                            onClick={this.validate}
                        />
                    </CardText>
                    <CardText style={{ display: this.state.showTable ? 'block' : 'none' }}>
                        <ValidationRulesAnalysisTable elements={this.state.elements} />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default ValidationRulesAnalysis;
