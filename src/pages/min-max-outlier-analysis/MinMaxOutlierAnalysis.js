/* React */
import React from 'react';

/* Material UI */
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import { FontIcon, IconButton } from 'material-ui';
import classNames from 'classnames';

/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateFeedbackState } from '../../reducers/feedback';

import { LOADING, SUCCESS } from '../../helpers/feedbackSnackBarTypes';

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

export default class MinMaxOutlierAnalysis extends Page {
    constructor() {
        super();

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            dataSetIds: [],
            elements: [],
            loading: false,
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
            this.setState({ loading: true });
            this.props.updateFeedbackState(true, {
                type: LOADING,
            });

            api.post(apiConf.endpoints.minMaxOutliersAnalysis, {
                startDate: convertDateToApiDateFormat(this.state.startDate),
                endDate: convertDateToApiDateFormat(this.state.endDate),
                organisationUnitId: this.state.organisationUnitId,
                dataSetIds: this.state.dataSetIds,
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

                    this.props.updateFeedbackState(feedback.showSnackbar, { ...feedback.snackbarConf });
                    this.setState({
                        loading: false,
                        elements,
                        showTable: elements && elements.length > 0,
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

    toggleCheckbox(element) {
        const api = this.context.d2.Api.getApi();
        const elements = this.state.elements;
        for (let i = 0; i < elements.length; i++) {
            const currentElement = elements[i];
            if (currentElement.key === element.key) {
                this.setState({ loading: true });
                this.props.updateFeedbackState(true, {
                    type: LOADING,
                });

                api.post(apiConf.endpoints.markDataValue, {
                    followups: [OutlierAnalyisTable.convertElementToToggleFollowupRequest(currentElement)],
                }).then(() => {
                    if (this.isPageMounted()) {
                        currentElement.marked = !currentElement.marked;
                        elements[i] = currentElement;

                        this.props.updateFeedbackState(true, {
                            type: SUCCESS,
                            message: i18n.t(
                                currentElement.marked ? i18nKeys.messages.marked : i18nKeys.messages.unmarked),
                        });

                        this.setState({
                            loading: false,
                            elements,
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
                    {i18n.t(i18nKeys.minMaxOutlierAnalysis.header)}
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
                                    {i18n.t(i18nKeys.minMaxOutlierAnalysis.form.dataSet)}
                                </div>
                                <AvailableDatasetsSelect onChange={this.dataSetsOnChange} />
                            </div>
                            <div className={classNames('col-md-4', cssPageStyles.section)}>
                                <div className={cssPageStyles.formLabel}>
                                    {i18n.t(i18nKeys.minMaxOutlierAnalysis.form.organisationUnit)}
                                </div>
                                <AvailableOrganisationUnitsTree onChange={this.organisationUnitOnChange} />
                            </div>
                            <div className={classNames('col-md-4', cssPageStyles.section)}>
                                <DatePicker
                                    id="start-date"
                                    textFieldStyle={jsPageStyles.inputForm}
                                    floatingLabelText={
                                        i18n.t(i18nKeys.minMaxOutlierAnalysis.form.startDate)
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
                                        i18n.t(i18nKeys.minMaxOutlierAnalysis.form.endDate)
                                    }
                                    onChange={this.endDateOnChange}
                                    defaultDate={new Date()}
                                    minDate={this.state.startDate}
                                    maxDate={new Date()}
                                    value={this.state.endDate}
                                />
                            </div>
                        </div>
                        <RaisedButton
                            id="start-analysis-button"
                            className={cssPageStyles.mainButton}
                            primary
                            label={i18n.t(i18nKeys.minMaxOutlierAnalysis.actionButton)}
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

const mapDispatchToProps = dispatch => bindActionCreators({
    updateFeedbackState,
}, dispatch);

export const ConnectedMinMaxOutlierAnalysis = connect(
    null,
    mapDispatchToProps,
)(MinMaxOutlierAnalysis);
