import React from 'react';
import classNames from 'classnames';

// Material UI
import { FontIcon, IconButton } from 'material-ui';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

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
import cssPageStyles from '../Page.css';
import jsPageStyles from '../PageStyles';

import FollowUpAnalysisTable from './FollowUpAnalysisTable';
import AlertBar from '../../components/alert-bar/AlertBar';

class FollowUpAnalysis extends Page {
    constructor() {
        super();

        this.state = {
            organisationUnitId: null,
            showTable: false,
        };

        this.organisationUnitChanged = this.organisationUnitChanged.bind(this);
        this.getFollowUpList = this.getFollowUpList.bind(this);
        this.back = this.back.bind(this);
    }

    organisationUnitChanged(organisationUnitId) {
        this.setState({
            organisationUnitId,
        });
    }

    getFollowUpList() {
        this.setState({ ...this.state, showTable: true });
    }

    back() {
        this.setState({ ...this.state, showTable: false });
    }

    render() {
        const translator = this.context.translator;
        const elements = [];
        let i = 0;
        for (i; i < 55; i++) {
            const one = {
                label: i,
                dataElement: `Bananas ${i}`,
                organisation: `Organisation ${i}`,
                period: 'Mês do Ano X',
                min: 10,
                max: 99999,
                value: 12345678,
                comment: 'A beautiful comment!',
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
                    <span>{translator(i18nKeys.followUpAnalysis.header)}</span>
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
                                        <span>{translator(i18nKeys.followUpAnalysis.form.organisationUnit)}</span>
                                        <AvailableOrganisationUnitsTree
                                            onChange={this.organisationUnitChanged}
                                        />
                                    </div>
                                    <div className={classNames('col-md-6', cssPageStyles.section)}>
                                        <DatasetsForOrganisationUnitSelect
                                            organisationUnitId={this.state.organisationUnitId}
                                        />
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={translator(i18nKeys.followUpAnalysis.form.startDate)}
                                            defaultDate={new Date()}
                                        />
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={translator(i18nKeys.followUpAnalysis.form.endDate)}
                                            defaultDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <RaisedButton
                                    className={cssPageStyles.mainButton}
                                    primary={Boolean(true)}
                                    label={translator(i18nKeys.followUpAnalysis.actionButtonFollow)}
                                    onClick={this.getFollowUpList}
                                />
                            </CardText>
                        ) : (
                            <CardText>
                                <FollowUpAnalysisTable elements={elements} />
                            </CardText>
                        )
                    }
                </Card>
            </div>
        );
    }
}

export default FollowUpAnalysis;
