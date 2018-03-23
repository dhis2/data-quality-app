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
import OutlierAnalyisTable, { generateElementKey } from '../../components/outlier-analysis-table/OutlierAnalysisTable';
import AlertBar from '../../components/alert-bar/AlertBar';

// i18n
import { i18nKeys } from '../../i18n';

// helpers
import { convertDateToApiDateFormat } from '../../helpers/dates';
import { getDocsKeyForSection } from '../sections.conf';
import { apiConf } from '../../server.conf';

// styles
import cssPageStyles from '../Page.css';
import jsPageStyles from '../PageStyles';

class MinMaxOutlierAnalysis extends Page {
    constructor() {
        super();

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            dataSetIds: [],
            elements: [],
        };

        this.start = this.start.bind(this);
        this.back = this.back.bind(this);

        this.startDateOnChange = this.startDateOnChange.bind(this);
        this.endDateOnChange = this.endDateOnChange.bind(this);
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this);
        this.dataSetsOnChange = this.dataSetsOnChange.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    start() {
        const api = this.context.d2.Api.getApi();
        if (this.isFormValid()) {
            api.post(apiConf.endpoints.minMaxOutliersAnalysis, {
                fromDate: convertDateToApiDateFormat(this.state.startDate),
                toDate: convertDateToApiDateFormat(this.state.endDate),
                organisationUnitId: this.state.organisationUnitId,
                dataSetIds: this.state.dataSetIds,
            }).then((response) => {
                if (this.isPageMounted()) {
                    const elements = response.map(e => ({
                        key: generateElementKey(e),
                        attributeOptionComboId: e.attributeOptionComboId,
                        categoryOptionComboId: e.categoryOptionComboId,
                        periodId: e.periodId,
                        sourceId: e.sourceId,
                        dataElementId: e.dataElementId,
                        dataElement: e.dataElementName,
                        organisation: e.sourceName,
                        period: e.period.name,
                        min: e.min,
                        max: e.max,
                        value: Number.parseInt(e.value, 10),
                        marked: e.followup,
                    }));

                    this.setState({
                        elements,
                        showTable: true,
                    });
                }
            }).catch(() => {
                if (this.isPageMounted()) {
                // TODO
                }
            });
        }
    }

    back() {
        this.setState({ showTable: false });
    }

    startDateOnChange(event, date) {
        this.setState({ startDate: new Date(date) });
    }

    endDateOnChange(event, date) {
        this.setState({ endDate: new Date(date) });
    }

    organisationUnitOnChange(organisationUnitId) {
        this.setState({ organisationUnitId });
    }

    dataSetsOnChange(event) {
        const dataSetIds = [];
        const selectedOptions = event.target.selectedOptions;
        for (let i = 0; i < selectedOptions.length; i++) {
            dataSetIds.push(selectedOptions[i].value);
        }
        this.setState({ dataSetIds });
    }

    toggleCheckbox(element) {
        const api = this.context.d2.Api.getApi();
        const elements = this.state.elements;
        for (let i = 0; i < elements.length; i++) {
            const currentElement = elements[i];
            if (currentElement.key === element.key) {
                api.post(apiConf.endpoints.markDataValue, {
                    followups: [
                        {
                            dataElementId: element.dataElementId,
                            periodId: element.periodId,
                            organisationUnitId: element.organisationUnitId,
                            categoryOptionComboId: element.categoryOptionComboId,
                            attributeOptionComboId: element.attributeOptionComboId,
                            followup: !currentElement.marked,
                        },
                    ],
                }).then(() => {
                    if (this.isPageMounted()) {
                        currentElement.marked = !currentElement.marked;
                        elements[i] = currentElement;
                        this.setState({
                            elements,
                        });
                    }
                }).catch(() => {
                    if (this.isPageMounted()) {
                        // TODO
                    }
                });
                break;
            }
        }
    }

    isFormValid() {
        return this.state.startDate &&
            this.state.endDate &&
            this.state.organisationUnitId &&
            this.state.dataSetIds &&
            this.state.dataSetIds.length > 0;
    }

    showAlertBar() {
        return this.state.elements && this.state.elements.length >= 500;
    }

    render() {
        const translator = this.context.translator;
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
                <AlertBar show={this.showAlertBar()} />
                <Card>
                    {
                        !this.state.showTable ? (
                            <CardText>
                                <div className="row">
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <span>
                                            {translator(i18nKeys.minMaxOutlierAnalysis.form.dataSet)}
                                        </span>
                                        <AvailableDatasetsSelect onChange={this.dataSetsOnChange} />
                                    </div>
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <span>
                                            {translator(i18nKeys.minMaxOutlierAnalysis.form.organisationUnit)}
                                        </span>
                                        <AvailableOrganisationUnitsTree onChange={this.organisationUnitOnChange} />
                                    </div>
                                    <div className={classNames('col-md-4', cssPageStyles.section)}>
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.minMaxOutlierAnalysis.form.startDate)
                                            }
                                            onChange={this.startDateOnChange}
                                            defaultDate={new Date()}
                                            maxDate={new Date()}
                                            value={this.state.startDate}
                                        />
                                        <DatePicker
                                            textFieldStyle={jsPageStyles.inputForm}
                                            floatingLabelText={
                                                translator(i18nKeys.minMaxOutlierAnalysis.form.endDate)
                                            }
                                            onChange={this.endDateOnChange}
                                            defaultDate={new Date()}
                                            maxDate={new Date()}
                                            value={this.state.endDate}
                                        />
                                    </div>
                                </div>
                                <RaisedButton
                                    className={cssPageStyles.mainButton}
                                    primary
                                    label={translator(i18nKeys.minMaxOutlierAnalysis.actionButton)}
                                    onClick={this.start}
                                    disabled={!this.isFormValid()}
                                />
                            </CardText>
                        ) : (
                            <CardText>
                                <OutlierAnalyisTable
                                    elements={this.state.elements}
                                    toggleCheckbox={this.toggleCheckbox}
                                />
                            </CardText>
                        )
                    }
                </Card>
            </div>
        );
    }
}

export default MinMaxOutlierAnalysis;
