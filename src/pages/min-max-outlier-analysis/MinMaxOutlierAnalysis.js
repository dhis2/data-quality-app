import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import { FontIcon, IconButton } from 'material-ui';

import classNames from 'classnames';

import Page from '../Page';
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import PageHelper from '../../components/page-helper/PageHelper';
import { getDocsKeyForSection } from '../sections.conf';

// i18n
import { i18nKeys } from '../../i18n';

// styles
import cssPageStyles from '../Page.css';
import jsPageStyles from '../PageStyles';
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable';
import AlertBar from '../../components/alert-bar/AlertBar';

class MinMaxOutlierAnalysis extends Page {
    constructor() {
        super();

        this.state = {
            showTable: false,
        };

        this.start = this.start.bind(this);
        this.back = this.back.bind(this);
    }

    start() {
        this.setState({ showTable: true });
    }

    back() {
        this.setState({ showTable: false });
    }

    render() {
        const translator = this.context.translator;
        const elements = [];
        let i = 0;
        for (i; i < 35; i++) {
            const one = {
                label: i,
                dataElement: `Data Element ${i}`,
                organisation: `Organisation ${i}`,
                period: 'Mês do Ano X',
                min: 10,
                max: 99999,
                value: 12345678,
                mark: 'A beautiful comment!',
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
                    {translator(i18nKeys.minMaxOutlierAnalysis.header)}
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
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <span>
                                            {translator(i18nKeys.minMaxOutlierAnalysis.form.dataSet)}
                                        </span>
                                        <AvailableDatasetsSelect />
                                    </div>
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <span>
                                            {translator(i18nKeys.minMaxOutlierAnalysis.form.organisationUnit)}
                                        </span>
                                        <AvailableOrganisationUnitsTree />
                                    </div>
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.minMaxOutlierAnalysis.form.startDate)
                                            }
                                            defaultDate={new Date()}
                                        />
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.minMaxOutlierAnalysis.form.endDate)
                                            }
                                            defaultDate={new Date()}
                                        />
                                    </div>
                                </div>
                                <RaisedButton
                                    className={cssPageStyles.mainButton}
                                    primary={Boolean(true)}
                                    label={translator(i18nKeys.minMaxOutlierAnalysis.actionButton)}
                                    onClick={this.start}
                                />
                            </CardText>
                        ) : (
                            <CardText>
                                <OutlierAnalyisTable elements={elements} />
                            </CardText>
                        )
                    }
                </Card>
            </div>
        );
    }
}

export default MinMaxOutlierAnalysis;
