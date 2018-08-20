/* React */
import React from 'react';

/* Material UI */
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import { FontIcon, IconButton } from 'material-ui';
import classNames from 'classnames';

/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../reducers/feedback';

/* Components */
import Page from '../Page';
import AlertBar from '../../components/alert-bar/AlertBar';
import ValidationRuleGroupsSelect, {
    ALL_VALIDATION_RULE_GROUPS_ID,
} from
    '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import PageHelper from '../../components/page-helper/PageHelper';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

/* helpers */
import { apiConf } from '../../server.conf';
import { convertDateToApiDateFormat } from '../../helpers/dates';
import { getDocsKeyForSection } from '../sections.conf';
import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

/* styles */
import jsPageStyles from '../PageStyles';
import cssPageStyles from '../Page.css';
import ValidationRulesAnalysisTable from './validation-rules-analysis-table/ValidationRulesAnalysisTable';

export default class ValidationRulesAnalysis extends Page {
    constructor() {
        super();

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
        };
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

    validate = () => {
        const api = this.context.d2.Api.getApi();

        if (this.isFormValid()) {
            const request = {
                startDate: convertDateToApiDateFormat(this.state.startDate),
                endDate: convertDateToApiDateFormat(this.state.endDate),
                organisationUnitId: this.state.organisationUnitId,
                notification: this.state.notification,
                persist: this.state.persist,
            };

            if (this.state.validationRuleGroupId !== ALL_VALIDATION_RULE_GROUPS_ID) {
                request.validationRuleGroupId = this.state.validationRuleGroupId;
            }

            this.setState({ loading: true });
            this.props.updateFeedbackState(true, {
                type: LOADING,
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
                            message: i18n.t(i18nKeys.messages.validationSuccess),
                        },
                    };

                    this.props.updateFeedbackState(feedback.showSnackbar, { ...feedback.snackbarConf });
                    this.setState({
                        loading: false,
                        elements,
                        showTable: elements && elements.length > 0,
                    });
                }
            }).catch(() => { this.manageError(); });
        }
    };

    back = () => {
        this.setState({ showTable: false });
    };

    startDateOnChange = (event, date) => {
        this.setState({ startDate: new Date(date) });
    };

    endDateOnChange = (event, date) => {
        this.setState({ endDate: new Date(date) });
    };

    organisationUnitOnChange = (organisationUnitId) => {
        this.setState({ organisationUnitId });
    };

    validationRuleGroupOnChange = (event, index, value) => {
        this.setState({ validationRuleGroupId: value });
    };

    updateSendNotifications = (event, checked) => {
        this.setState({ notification: checked });
    };

    updatePersistNewResults = (event, checked) => {
        this.setState({ persist: checked });
    };

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
                    {i18n.t(i18nKeys.validationRulesAnalysis.header)}
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
                                    {i18n.t(i18nKeys.validationRulesAnalysis.form.organisationUnit)}
                                </div>
                                <AvailableOrganisationUnitsTree onChange={this.organisationUnitOnChange} />
                            </div>
                            <div className={classNames('col-md-6', cssPageStyles.section)}>
                                <DatePicker
                                    id="start-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        i18n.t(i18nKeys.validationRulesAnalysis.form.startDate)
                                    }
                                    onChange={this.startDateOnChange}
                                    value={this.state.startDate}
                                    defaultDate={new Date()}
                                    maxDate={this.state.endDate}
                                />
                                <DatePicker
                                    id="end-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        i18n.t(i18nKeys.validationRulesAnalysis.form.endDate)
                                    }
                                    onChange={this.endDateOnChange}
                                    value={this.state.endDate}
                                    defaultDate={new Date()}
                                    minDate={this.state.startDate}
                                    maxDate={new Date()}
                                />
                                <div id="validation-rule-groups">
                                    <ValidationRuleGroupsSelect
                                        style={jsPageStyles.inputForm}
                                        onChange={this.validationRuleGroupOnChange}
                                    />
                                </div>
                                <div id="send-notifications-option">
                                    <Checkbox
                                        label={i18n.t(i18nKeys.validationRulesAnalysis.form.notification)}
                                        labelPosition="left"
                                        checked={this.state.notification}
                                        onCheck={this.updateSendNotifications}
                                    />
                                </div>
                                <div id="persist-results-option">
                                    <Checkbox
                                        label={i18n.t(i18nKeys.validationRulesAnalysis.form.persist)}
                                        labelPosition="left"
                                        checked={this.state.persist}
                                        onCheck={this.updatePersistNewResults}
                                    />
                                </div>
                            </div>
                        </div>
                        <RaisedButton
                            id="start-analysis-button"
                            className={cssPageStyles.mainButton}
                            label={i18n.t(i18nKeys.validationRulesAnalysis.actionButton)}
                            primary
                            disabled={this.isActionDisabled()}
                            onClick={this.validate}
                        />
                    </CardText>
                    <CardText id="results-table" style={{ display: this.state.showTable ? 'block' : 'none' }}>
                        <ValidationRulesAnalysisTable elements={this.state.elements} />
                    </CardText>
                </Card>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({
    updateFeedbackState,
}, dispatch);

export const ConnnectedValidationRulesAnalysis = connect(
    null,
    mapDispatchToProps,
)(ValidationRulesAnalysis);
