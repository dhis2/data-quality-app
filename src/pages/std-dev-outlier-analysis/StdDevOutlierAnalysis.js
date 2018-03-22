import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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


class StdDevOutlierAnalysis extends Page {
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
                dataElement: `Bananas ${i}`,
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
                    {translator(i18nKeys.stdDevOutlierAnalysis.header)}
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
                                            {translator(i18nKeys.stdDevOutlierAnalysis.form.dataSet)}
                                        </span>
                                        <AvailableDatasetsSelect />
                                    </div>
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <span>
                                            {translator(i18nKeys.stdDevOutlierAnalysis.form.organisationUnit)}
                                        </span>
                                        <AvailableOrganisationUnitsTree />
                                    </div>
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.stdDevOutlierAnalysis.form.startDate)
                                            }
                                            defaultDate={new Date()}
                                        />
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.stdDevOutlierAnalysis.form.endDate)
                                            }
                                            defaultDate={new Date()}
                                        />
                                        <SelectField
                                            style={jsPageStyles.inputForm}
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
                                </div>
                                <RaisedButton
                                    className={cssPageStyles.mainButton}
                                    primary={Boolean(true)}
                                    label={translator(i18nKeys.stdDevOutlierAnalysis.actionButton)}
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

export default StdDevOutlierAnalysis;
