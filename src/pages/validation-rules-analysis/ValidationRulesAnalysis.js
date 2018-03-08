import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import Checkbox from 'material-ui/Checkbox';

import Page from '../Page';
import ValidationRuleGroupsSelect from
    '../../components/validation-rule-groups-select/ValidationRuleGroupsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';

// i18n
import { i18nKeys } from '../../i18n';

// cssClasses
import cssClasses from './ValidationRulesAnalysis.css';

const styles = {
    inputForm: {
        width: '100%',
    },
};

class ValidationRulesAnalysis extends Page {
    render() {
        const translator = this.context.translator;
        return (
            <div className="page-wrapper">
                <h1>
                    {translator(i18nKeys.validationRulesAnalysis.header)}
                </h1>
                <Card>
                    <CardText>
                        <div className={cssClasses.container}>
                            <div className={cssClasses.left}>
                                <DatePicker
                                    textFieldStyle={styles.inputForm}
                                    floatingLabelText={translator(i18nKeys.validationRulesAnalysis.form.startDate)}
                                    defaultDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={styles.inputForm}
                                    floatingLabelText={translator(i18nKeys.validationRulesAnalysis.form.endDate)}
                                    defaultDate={new Date()}
                                />
                                <ValidationRuleGroupsSelect style={styles.inputForm} />
                                <Checkbox
                                    label={translator(i18nKeys.validationRulesAnalysis.form.sendNotifications)}
                                    labelPosition="left"
                                />
                                <Checkbox
                                    label={translator(i18nKeys.validationRulesAnalysis.form.persistNewResults)}
                                    labelPosition="left"
                                />
                            </div>
                            <div className={cssClasses.right}>
                                <span>{translator(i18nKeys.validationRulesAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree />
                            </div>
                        </div>
                        <RaisedButton
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
