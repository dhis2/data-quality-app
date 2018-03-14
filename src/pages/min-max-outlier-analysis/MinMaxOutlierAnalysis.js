import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

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

class MinMaxOutlierAnalysis extends Page {
    render() {
        const translator = this.context.translator;
        return (
            <div className="page-wrapper">
                <h1>
                    {translator(i18nKeys.minMaxOutlierAnalysis.header)}
                </h1>
                <Card>
                    <CardText>
                        <div className="row">
                            <div className={classNames('col-md-4', cssClasses.section)}>
                                <span>{translator(i18nKeys.minMaxOutlierAnalysis.form.dataSet)}</span>
                                <AvailableDatasetsSelect />
                            </div>
                            <div className={classNames('col-md-4', cssClasses.section)}>
                                <span>{translator(i18nKeys.minMaxOutlierAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree />
                            </div>
                            <div className={classNames('col-md-4', cssClasses.section)}>
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.minMaxOutlierAnalysis.form.startDate)}
                                    defaultDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.minMaxOutlierAnalysis.form.endDate)}
                                    defaultDate={new Date()}
                                />
                            </div>
                        </div>
                        <RaisedButton
                            className={cssClasses.mainButton}
                            primary={Boolean(true)}
                            label={translator(i18nKeys.minMaxOutlierAnalysis.actionButton)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default MinMaxOutlierAnalysis;
