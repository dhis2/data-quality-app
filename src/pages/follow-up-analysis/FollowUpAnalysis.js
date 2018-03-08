import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import Page from '../Page';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import DatasetsForOrganisationUnitSelect from
    '../../components/datasets-for-organisation-unit-select/DatasetsForOrganisationUnitSelect';

// i18n
import { i18nKeys } from '../../i18n';

// cssClasses
import cssClasses from './FollowUpAnalysis.css';

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
                </h1>
                <Card>
                    <CardText>
                        <div className={cssClasses.container}>
                            <div className={cssClasses.left}>
                                <span>{translator(i18nKeys.followUpAnalysis.form.organisationUnit)}</span>
                                <AvailableOrganisationUnitsTree
                                    onChange={this.organisationUnitChanged}
                                />
                            </div>
                            <div className={cssClasses.right}>
                                <DatasetsForOrganisationUnitSelect
                                    organisationUnitId={this.state.organisationUnitId}
                                />
                            </div>
                        </div>
                        <RaisedButton
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
