import React from 'react';

// Material UI
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { FontIcon, IconButton } from 'material-ui';

import { SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import classNames from 'classnames';

import Page from '../Page';
import AvailableDatasetsSelect from '../../components/available-datasets-select/AvailableDatasetsSelect';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import PageHelper from '../../components/page-helper/PageHelper';
import OutlierAnalyisTable from '../../components/outlier-analysis-table/OutlierAnalysisTable';
import AlertBar from '../../components/alert-bar/AlertBar';

/* i18n */
import i18n from '../../locales';
import { i18nKeys } from '../../i18n';

// helpers
import { convertDateToApiDateFormat } from '../../helpers/dates';
import { getDocsKeyForSection } from '../sections.conf';
import { apiConf } from '../../server.conf';

// styles
import cssPageStyles from '../Page.css';
import jsPageStyles from '../PageStyles';

export const DEFAULT_STANDARD_DEVIATION = 3.0;

class StdDevOutlierAnalysis extends Page {
    static STATE_PROPERTIES = [
        'showTable',
        'startDate',
        'endDate',
        'organisationUnitId',
        'dataSetIds',
        'elements',
        'standardDeviation',
        'loading',
    ];

    constructor() {
        super();

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            dataSetIds: [],
            elements: [],
            standardDeviation: DEFAULT_STANDARD_DEVIATION,
        };

        this.start = this.start.bind(this);
        this.back = this.back.bind(this);

        this.startDateOnChange = this.startDateOnChange.bind(this);
        this.endDateOnChange = this.endDateOnChange.bind(this);
        this.organisationUnitOnChange = this.organisationUnitOnChange.bind(this);
        this.dataSetsOnChange = this.dataSetsOnChange.bind(this);
        this.standardDeviationOnChange = this.standardDeviationOnChange.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && StdDevOutlierAnalysis.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    start() {
        const api = this.context.d2.Api.getApi();
        if (this.isFormValid()) {
            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            });

            api.post(apiConf.endpoints.standardDeviationOutliersAnalysis, {
                startDate: convertDateToApiDateFormat(this.state.startDate),
                endDate: convertDateToApiDateFormat(this.state.endDate),
                ou: this.state.organisationUnitId,
                ds: this.state.dataSetIds,
                standardDeviation: this.state.standardDeviation,
            }).then((response) => {
                if (this.isPageMounted()) {
                    const elements = response.map(OutlierAnalyisTable.convertElementFromApiResponse);

                    const feedback = elements && elements.length > 0 ? {
                        showSnackbar: false,
                    } : {
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: i18n.t(i18nKeys.messages.noValuesFound),
                        },
                    };

                    this.context.updateAppState({
                        ...feedback,
                        pageState: {
                            loading: false,
                            elements,
                            showTable: elements && elements.length > 0,
                        },
                    });
                }
            }).catch(() => { this.manageError(); });
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

    standardDeviationOnChange(event, index, value) {
        this.setState({ standardDeviation: value });
    }

    toggleCheckbox(element) {
        const api = this.context.d2.Api.getApi();
        const elements = this.state.elements;
        for (let i = 0; i < elements.length; i++) {
            const currentElement = elements[i];
            if (currentElement.key === element.key) {
                this.context.updateAppState({
                    pageState: {
                        loading: true,
                    },
                });
                api.post(apiConf.endpoints.markDataValue, {
                    followups: [OutlierAnalyisTable.convertElementToToggleFollowupRequest(currentElement)],
                }).then(() => {
                    if (this.isPageMounted()) {
                        currentElement.marked = !currentElement.marked;
                        elements[i] = currentElement;

                        this.context.updateAppState({
                            showSnackbar: true,
                            snackbarConf: {
                                type: SUCCESS,
                                message: i18n.t(
                                    currentElement.marked ? i18nKeys.messages.marked : i18nKeys.messages.unmarked),
                            },
                            pageState: {
                                elements,
                                loading: false,
                            },
                        });
                    }
                }).catch(() => { this.manageError(); });
                break;
            }
        }
    }

    isFormValid() {
        return this.state.startDate &&
            this.state.endDate &&
            this.state.organisationUnitId &&
            this.state.standardDeviation &&
            this.state.dataSetIds &&
            this.state.dataSetIds.length > 0;
    }

    isActionDisabled() {
        return !this.isFormValid() || this.state.loading;
    }

    showAlertBar() {
        return this.state.showTable &&
            this.state.elements &&
            this.state.elements.length >= apiConf.results.analysis.limit;
    }

    render() {
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
                    {i18n.t(i18nKeys.stdDevOutlierAnalysis.header)}
                    <PageHelper
                        sectionDocsKey={getDocsKeyForSection(this.props.sectionKey)}
                    />
                </h1>
                <AlertBar show={this.showAlertBar()} />
                <Card>
                    {/* FORM: hidden using style to avoid not needed api requests when going back from table */}
                    <CardText style={{ display: !this.state.showTable ? 'block' : 'none' }}>
                        <div className="row">
                            <div id="data-sets-container" className={classNames('col-md-4', cssPageStyles.section)}>
                                <div className={cssPageStyles.formLabel}>
                                    {i18n.t(i18nKeys.stdDevOutlierAnalysis.form.dataSet)}
                                </div>
                                <AvailableDatasetsSelect onChange={this.dataSetsOnChange} />
                            </div>
                            <div className={classNames('col-md-4', cssPageStyles.section)}>
                                <div className={cssPageStyles.formLabel}>
                                    {i18n.t(i18nKeys.stdDevOutlierAnalysis.form.organisationUnit)}
                                </div>
                                <AvailableOrganisationUnitsTree onChange={this.organisationUnitOnChange} />
                            </div>
                            <div className={classNames('col-md-4', cssPageStyles.section)}>
                                <DatePicker
                                    id="start-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        i18n.t(i18nKeys.stdDevOutlierAnalysis.form.startDate)
                                    }
                                    onChange={this.startDateOnChange}
                                    defaultDate={new Date()}
                                    maxDate={this.state.endDate}
                                    value={this.state.startDate}
                                />
                                <DatePicker
                                    id="end-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        i18n.t(i18nKeys.stdDevOutlierAnalysis.form.endDate)
                                    }
                                    onChange={this.endDateOnChange}
                                    defaultDate={new Date()}
                                    minDate={this.state.startDate}
                                    maxDate={new Date()}
                                    value={this.state.endDate}
                                />
                                <SelectField
                                    id="standard-deviation"
                                    style={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        i18n.t(i18nKeys.stdDevOutlierAnalysis.form.standardDeviations)
                                    }
                                    onChange={this.standardDeviationOnChange}
                                    value={this.state.standardDeviation}
                                >
                                    <MenuItem value={1.0} primaryText="1.0" />
                                    <MenuItem value={1.5} primaryText="1.5" />
                                    <MenuItem value={2.0} primaryText="2.0" />
                                    <MenuItem value={2.5} primaryText="2.5" />
                                    <MenuItem value={3} primaryText="3.0" />
                                    <MenuItem value={3.5} primaryText="3.5" />
                                    <MenuItem value={4} primaryText="4.0" />
                                    <MenuItem value={4.5} primaryText="4.5" />
                                    <MenuItem value={5} primaryText="5.0" />
                                </SelectField>
                            </div>
                        </div>
                        <RaisedButton
                            id="start-analysis-button"
                            className={cssPageStyles.mainButton}
                            primary
                            label={i18n.t(i18nKeys.stdDevOutlierAnalysis.actionButton)}
                            onClick={this.start}
                            disabled={this.isActionDisabled()}
                        />
                    </CardText>
                    {/* TABLE */}
                    <CardText id="results-table" style={{ display: this.state.showTable ? 'block' : 'none' }}>
                        <OutlierAnalyisTable
                            elements={this.state.elements}
                            toggleCheckbox={this.toggleCheckbox}
                        />
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default StdDevOutlierAnalysis;
