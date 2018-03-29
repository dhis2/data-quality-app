import React from 'react';
import classNames from 'classnames';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';
import { FontIcon, IconButton } from 'material-ui';

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
    constructor() {
        super();

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            validationRuleGroupId: -1,
            sendNotifications: false,
            persistNewResults: false,
            elements: [],
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

    static convertElementFromApiResponse = e => ({
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

        api.post(apiConf.endpoints.validationRulesAnalysis, { ...request }).then((response) => {
            if (this.isPageMounted()) {
                const elements = response.map(ValidationRulesAnalysis.convertElementFromApiResponse);
                this.setState({ ...this.state, showTable: true, elements });
            }
        }).catch(this.manageError.bind(this));    // FIXME why do I need bind
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
                <AlertBar show={Boolean(true)} />
                <Card>
                    <CardText style={{ display: !this.state.showTable ? 'block' : 'none' }}>
                        <div className="row">
                            <div className={classNames('col-md-6', cssPageStyles.section)}>
                                <span>
                                    {translator(i18nKeys.validationRulesAnalysis.form.organisationUnit)}
                                </span>
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
                                />
                                <DatePicker
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        translator(i18nKeys.validationRulesAnalysis.form.endDate)
                                    }
                                    onChange={this.endDateOnChange}
                                    value={this.state.endDate}
                                    defaultDate={new Date()}
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
                            primary={Boolean(true)}
                            label={translator(i18nKeys.validationRulesAnalysis.actionButton)}
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
