import React from 'react';

// Material UI
import { FontIcon, IconButton } from 'material-ui';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';

import { SUCCESS } from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbarTypes';

import classNames from 'classnames';

import Page from '../Page';
import AvailableOrganisationUnitsTree from
    '../../components/available-organisation-units-tree/AvailableOrganisationUnitsTree';
import DatasetsForOrganisationUnitSelect, { ALL_DATA_SETS_OPTION_ID } from
    '../../components/datasets-for-organisation-unit-select/DatasetsForOrganisationUnitSelect';
import PageHelper from '../../components/page-helper/PageHelper';
import FollowUpAnalysisTable from './follow-up-analysis-table/FollowUpAnalysisTable';
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

class FollowUpAnalysis extends Page {
    static STATE_PROPERTIES = [
        'showTable',
        'startDate',
        'endDate',
        'organisationUnitId',
        'dataSetId',
        'elements',
        'loading',
    ]

    constructor() {
        super();

        this.state = {
            showTable: false,
            startDate: new Date(),
            endDate: new Date(),
            organisationUnitId: null,
            dataSetId: ALL_DATA_SETS_OPTION_ID,
            elements: [],
            loading: false,
        };


        this.getFollowUpList = this.getFollowUpList.bind(this);
        this.backToHome = this.backToHome.bind(this);

        this.startDateOnChange = this.startDateOnChange.bind(this);
        this.endDateOnChange = this.endDateOnChange.bind(this);
        this.organisationUnitChanged = this.organisationUnitChanged.bind(this);
        this.dataSetOnChange = this.dataSetOnChange.bind(this);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.unfollow = this.unfollow.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && FollowUpAnalysis.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    getFollowUpList() {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        if (this.isFormValid()) {
            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            });

            const request = {
                fromDate: convertDateToApiDateFormat(this.state.startDate),
                toDate: convertDateToApiDateFormat(this.state.endDate),
                organisationUnitId: this.state.organisationUnitId,
            };

            if (this.state.dataSetId !== ALL_DATA_SETS_OPTION_ID) {
                request.dataSetId = this.state.dataSetId;
            }

            api.post(apiConf.endpoints.folloupAnalysis, request).then((response) => {
                if (this.isPageMounted()) {
                    const elements = response.map(FollowUpAnalysisTable.convertElementFromApiResponse);

                    const feedback = elements && elements.length > 0 ? {
                        showSnackbar: false,
                    } : {
                        showSnackbar: true,
                        snackbarConf: {
                            type: SUCCESS,
                            message: translator(i18nKeys.messages.noValuesFound),
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

    backToHome() {
        this.setState({ ...this.state, showTable: false });
    }

    startDateOnChange(event, date) {
        this.setState({ startDate: new Date(date) });
    }

    endDateOnChange(event, date) {
        this.setState({ endDate: new Date(date) });
    }

    organisationUnitChanged(organisationUnitId) {
        this.setState({
            organisationUnitId,
        });
    }

    dataSetOnChange(event, index, value) {
        this.setState({ dataSetId: value });
    }

    toggleCheckbox(element) {
        const elements = this.state.elements;
        for (let i = 0; i < elements.length; i++) {
            const currentElement = elements[i];
            if (currentElement.key === element.key) {
                currentElement.marked = !currentElement.marked;
                elements[i] = currentElement;
                this.setState({ elements });
                break;
            }
        }
    }

    unfollow(unfollowups) {
        const translator = this.context.translator;
        const api = this.context.d2.Api.getApi();
        this.context.updateAppState({
            pageState: {
                loading: true,
            },
        });

        api.post(apiConf.endpoints.markDataValue, {
            followups: unfollowups,
        }).then(() => {
            if (this.isPageMounted()) {
                // remove unfollowed elements
                const elements = this.state.elements.filter((element) => {
                    for (let j = 0; j < unfollowups.length; j++) {
                        const unfollow = unfollowups[j];
                        if (FollowUpAnalysisTable.areElementsTheSame(element, unfollow)) {
                            return false;
                        }
                    }

                    return true;
                });

                this.context.updateAppState({
                    showSnackbar: true,
                    snackbarConf: {
                        type: SUCCESS,
                        message: translator(i18nKeys.messages.unfollow),
                    },
                    pageState: {
                        loading: false,
                        elements,
                    },
                });
            }
        }).catch(() => { this.manageError(); });
    }

    isFormValid() {
        return this.state.startDate &&
        this.state.endDate &&
        this.state.organisationUnitId;
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
        const translator = this.context.translator;
        return (
            <div>
                <h1 className={cssPageStyles.pageHeader}>
                    <IconButton
                        onClick={this.backToHome}
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
                <AlertBar show={this.showAlertBar()} />
                <Card>
                    <CardText>
                        {/* FORM: hidden using style to avoid not needed api requests when going back from table */}
                        <div style={{ display: !this.state.showTable ? 'block' : 'none' }}>
                            <div className="row">
                                <div className={classNames('col-md-6', cssPageStyles.section)}>
                                    <div className={cssPageStyles.formLabel}>
                                        {translator(i18nKeys.followUpAnalysis.form.organisationUnit)}
                                    </div>
                                    <AvailableOrganisationUnitsTree
                                        onChange={this.organisationUnitChanged}
                                    />
                                </div>
                                <div className={classNames('col-md-6', cssPageStyles.section)}>
                                    <DatasetsForOrganisationUnitSelect
                                        organisationUnitId={this.state.organisationUnitId}
                                        onChange={this.dataSetOnChange}
                                    />
                                    <DatePicker
                                        textFieldStyle={jsPageStyles.inputForm}
                                        floatingLabelText={translator(i18nKeys.followUpAnalysis.form.startDate)}
                                        onChange={this.startDateOnChange}
                                        defaultDate={new Date()}
                                        maxDate={this.state.endDate}
                                        value={this.state.startDate}
                                    />
                                    <DatePicker
                                        textFieldStyle={jsPageStyles.inputForm}
                                        floatingLabelText={translator(i18nKeys.followUpAnalysis.form.endDate)}
                                        onChange={this.endDateOnChange}
                                        defaultDate={new Date()}
                                        minDate={this.state.startDate}
                                        maxDate={new Date()}
                                        value={this.state.endDate}
                                    />
                                </div>
                            </div>
                            <RaisedButton
                                className={cssPageStyles.mainButton}
                                primary
                                label={translator(i18nKeys.followUpAnalysis.actionButtonFollow)}
                                onClick={this.getFollowUpList}
                                disabled={this.isActionDisabled()}
                            />
                        </div>
                        {/* TABLE */}
                        <div style={{ display: this.state.showTable ? 'block' : 'none' }}>
                            <CardText>
                                <FollowUpAnalysisTable
                                    elements={this.state.elements}
                                    toggleCheckbox={this.toggleCheckbox}
                                    unfollow={this.unfollow}
                                    loading={this.state.loading}
                                />
                            </CardText>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default FollowUpAnalysis;
