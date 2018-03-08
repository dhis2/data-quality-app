import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import Page from '../Page';
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';

// i18n
import { i18nKeys } from '../../i18n';

// cssClasses
import cssClasses from './MinMaxOutlierAnalysis.css';

const styles = {
    inputForm: {
        width: '100%',
    },
};

class MinMaxOutlierAnalysis extends Page {
    render() {
        const translator = this.context.translator;
        return (
            <div className="page-wrapper">
                <h1 className={cssClasses.header}>
                    {translator(i18nKeys.stdDevOutlierAnalysis.header)}
                </h1>
                <Card>
                    <CardText>
                        <div className={cssClasses.container}>
                            <div className={cssClasses.section}>
                                <DatePicker
                                    textFieldStyle={styles.inputForm}
                                    floatingLabelText={translator(i18nKeys.minMaxOutlierAnalysis.form.startDate)}
                                    defaultDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={styles.inputForm}
                                    floatingLabelText={translator(i18nKeys.minMaxOutlierAnalysis.form.endDate)}
                                    defaultDate={new Date()}
                                />
                            </div>
                            <div className={cssClasses.section}>
                                <span>{translator(i18nKeys.minMaxOutlierAnalysis.form.dataSet)}</span>
                                <AvailableDatasetsSelect />
                            </div>
                            <div className={cssClasses.section}>
                                <span>{translator(i18nKeys.minMaxOutlierAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree />
                            </div>
                        </div>
                        <RaisedButton
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
