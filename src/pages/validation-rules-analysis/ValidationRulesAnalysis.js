import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';

import classNames from 'classnames';

import Page from '../Page';
import ValidationRuleGroupsSelect from
    '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

// styles
import pageStyles from '../PageStyles';
import cssClasses from '../Page.css';

class ValidationRulesAnalysis extends Page {
    render() {
        const translator = this.context.translator;
        return (
            <div className="page-wrapper">
                <h1>
                    {translator(i18nKeys.validationRulesAnalysis.header)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card>
                    <CardText>
                        <div className="row">
                            <div className={classNames('col-md-6', cssClasses.section)}>
                                <span>{translator(i18nKeys.validationRulesAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree />
                            </div>
                            <div className={classNames('col-md-6', cssClasses.section)}>
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.validationRulesAnalysis.form.startDate)}
                                    defaultDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.validationRulesAnalysis.form.endDate)}
                                    defaultDate={new Date()}
                                />
                                <ValidationRuleGroupsSelect style={pageStyles.inputForm} />
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
                            className={cssClasses.mainButton}
                            primary={Boolean(true)}
                            label={translator(i18nKeys.validationRulesAnalysis.actionButton)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default ValidationRulesAnalysis;
