import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import classNames from 'classnames';

import Page from '../Page';
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';

// i18n
import { i18nKeys } from '../../i18n';

// styles
import pageStyles from '../PageStyles';
import cssClasses from '../Page.css';

class StdDevOutlierAnalysis extends Page {
    render() {
        const translator = this.context.translator;
        return (
            <div className="page-wrapper">
                <h1>
                    {translator(i18nKeys.stdDevOutlierAnalysis.header)}
                </h1>
                <Card>
                    <CardText>
                        <div className="row">
                            <div className={classNames('col-md-4', cssClasses.section)}>
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.stdDevOutlierAnalysis.form.startDate)}
                                    defaultDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.stdDevOutlierAnalysis.form.endDate)}
                                    defaultDate={new Date()}
                                />
                                <SelectField
                                    style={pageStyles.inputForm}
                                    floatingLabelText={
                                        translator(i18nKeys.stdDevOutlierAnalysis.form.standardDeviations)
                                    }
                                    value={3.0}
                                >
                                    <MenuItem value={1.0} primaryText="1.0" />
                                    <MenuItem value={1.5} primaryText="1.5" />
                                    <MenuItem value={2.0} primaryText="2.0" />
                                    <MenuItem value={2.5} primaryText="2.5" />
                                    <MenuItem value={3} primaryText="3.0" />
                                    <MenuItem value={3.5} primaryText="3.5" />
                                    <MenuItem value={4} primaryText="4.0" />
                                    <MenuItem value={4.5} primaryText="4.5" />
                                    <MenuItem value={5} primaryText="5" />
                                </SelectField>
                            </div>
                            <div className={classNames('col-md-4', cssClasses.section)}>
                                <span>{translator(i18nKeys.stdDevOutlierAnalysis.form.dataSet)}</span>
                                <AvailableDatasetsSelect />
                            </div>
                            <div className={classNames('col-md-4', cssClasses.section)}>
                                <span>{translator(i18nKeys.stdDevOutlierAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree />
                            </div>
                        </div>
                        <RaisedButton
                            className={cssClasses.mainButton}
                            primary={Boolean(true)}
                            label={translator(i18nKeys.stdDevOutlierAnalysis.actionButton)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default StdDevOutlierAnalysis;
