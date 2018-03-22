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
import ValidationRuleGroupsSelect from
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


class ValidationRulesAnalysis extends Page {
    constructor() {
        super();

        this.state = {
            showTable: false,
        };

        this.validate = this.validate.bind(this);
        this.back = this.back.bind(this);
    }

    validate() {
        this.setState({ showTable: true });
    }

    back() {
        this.setState({ showTable: false });
    }

    render() {
        const translator = this.context.translator;
        const elements = [];
        let i = 0;
        for (i; i < 55; i++) {
            const one = {
                label: i,
                organisation: `Organisation ${i}`,
                period: 'Mês do Ano X',
                importance: 10,
                validationRule: 99999,
                valueOne: 12345678,
                operator: '<=',
                valueTwo: 1234,
                details: 'A beautiful detail!',
            };
            elements.push(one);
        }
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
                    {
                        !this.state.showTable ? (
                            <CardText>
                                <div className="row">
                                    <div className={classNames('col-md-6', cssPageStyles.section)}>
                                        <span>
                                            {translator(i18nKeys.validationRulesAnalysis.form.organisationUnit)}
                                        </span>
                                        <AvailableOrganisationUnitsTree />
                                    </div>
                                    <div className={classNames('col-md-6', cssPageStyles.section)}>
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.validationRulesAnalysis.form.startDate)
                                            }
                                            defaultDate={new Date()}
                                        />
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.validationRulesAnalysis.form.endDate)
                                            }
                                            defaultDate={new Date()}
                                        />
                                        <ValidationRuleGroupsSelect style={jsPageStyles.inputForm} />
                                        <Checkbox
                                            label={translator(i18nKeys.validationRulesAnalysis.form.sendNotifications)}
                                            labelPosition="left"
                                        />
                                        <Checkbox
                                            label={translator(i18nKeys.validationRulesAnalysis.form.persistNewResults)}
                                            labelPosition="left"
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
                        ) : (
                            <CardText>
                                <ValidationRulesAnalysisTable elements={elements} />
                            </CardText>
                        )
                    }
                </Card>
            </div>
        );
    }
}

export default ValidationRulesAnalysis;
