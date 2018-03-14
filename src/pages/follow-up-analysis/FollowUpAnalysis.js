import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import classNames from 'classnames';

import Page from '../Page';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import DatasetsForOrganisationUnitSelect from
    '../../components/datasets-for-organisation-unit-select/DatasetsForOrganisationUnitSelect';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

// styles
import cssClasses from '../Page.css';
import pageStyles from '../PageStyles';

class FollowUpAnalysis extends Page {
    constructor() {
        super();

        this.state = {
            organisationUnitId: null,
        };

        this.organisationUnitChanged = this.organisationUnitChanged.bind(this);
    }

    organisationUnitChanged(organisationUnitId) {
        this.setState({
            organisationUnitId,
        });
    }

    render() {
        const translator = this.context.translator;
        return (
            <div className="page-wrapper">
                <h1>
                    {translator(i18nKeys.followUpAnalysis.header)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <Card>
                    <CardText>
                        <div className="row">
                            <div className={classNames('col-md-6', cssClasses.section)}>
                                <span>{translator(i18nKeys.followUpAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree
                                    onChange={this.organisationUnitChanged}
                                />
                            </div>
                            <div className={classNames('col-md-6', cssClasses.section)}>
                                <DatasetsForOrganisationUnitSelect
                                    organisationUnitId={this.state.organisationUnitId}
                                />
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.followUpAnalysis.form.startDate)}
                                    defaultDate={new Date()}
                                />
                                <DatePicker
                                    textFieldStyle={pageStyles.inputForm}
                                    floatingLabelText={translator(i18nKeys.followUpAnalysis.form.endDate)}
                                    defaultDate={new Date()}
                                />
                            </div>
                        </div>
                        <RaisedButton
                            className={cssClasses.mainButton}
                            primary={Boolean(true)}
                            label={translator(i18nKeys.followUpAnalysis.actionButton)}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default FollowUpAnalysis;
