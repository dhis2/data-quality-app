import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, FontIcon } from 'material-ui';

import classNames from 'classnames';

/* i18n */
import i18n from '../../../locales';
import { i18nKeys } from '../../../i18n';

import Page from '../../Page';

import jsPageStyles from '../../PageStyles';
import cssPageStyles from '../../Page.css';
import styles from './ValidationRulesDetails.css';

import FormattedNumber from '../../../components/formatters/FormattedNumber';
import { apiConf } from '../../../server.conf';
import ValidationRulesAnalysis from '../ValidationRulesAnalysis';

class ValidationRulesDetails extends Page {
    static STATE_PROPERTIES = [
        'loading',
    ];

    static propTypes = {
        validationRuleId: PropTypes.string.isRequired,
        periodId: PropTypes.string.isRequired,
        organisationUnitId: PropTypes.string.isRequired,
    }

    constructor() {
        super();

        this.state = {
            loading: false,
            openDetails: false,
            rule: {},
            expression: {
                leftSide: [],
                rightSide: [],
            },
        };

        this.loadDetails = this.loadDetails.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const nextState = {};

        Object.keys(nextProps).forEach((property) => {
            if (nextProps.hasOwnProperty(property) && ValidationRulesAnalysis.STATE_PROPERTIES.includes(property)) {
                nextState[property] = nextProps[property];
            }
        });

        if (nextState !== {}) {
            this.setState(nextState);
        }
    }

    loadDetails() {
        if (!this.state.loading) {
            const api = this.context.d2.Api.getApi();
            const requestRule = `${apiConf.endpoints.validationRules}/${this.props.validationRuleId}`;
            const requestExpression = `${apiConf.endpoints.validationRulesExpression}` +
                `?validationRuleId=${this.props.validationRuleId}` +
                `&periodId=${this.props.periodId}` +
                `&organisationUnitId=${this.props.organisationUnitId}`;
            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            });
            Promise.all([api.get(requestRule), api.get(requestExpression)]).then(([rule, expression]) => {
                this.context.updateAppState({
                    pageState: {
                        loading: false,
                    },
                });
                this.setState({ openDetails: true, rule, expression });
            }).catch(() => {
                this.manageError();
            });
        }
    }

    handleClose() {
        this.setState({ openDetails: false });
    }

    render() {
        // Details Actions
        const dialogActions = [
            <FlatButton
                className="close-action"
                key={`FB${this.props.organisationUnitId}-${this.props.periodId}-${this.props.validationRuleId}`}
                label={i18n.t(i18nKeys.validationRulesAnalysis.details.close)}
                primary={Boolean(true)}
                onClick={this.handleClose}
            />,
        ];

        const result = (
            <div className={classNames('row', 'results-row', styles.sectionBox)}>
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {i18n.t(i18nKeys.validationRulesAnalysis.details.resultSectionTitle)}
                </div>
                <div className={classNames('col-xs-12', styles.sectionSubTitle)}>
                    {i18n.t(i18nKeys.validationRulesAnalysis.details.rule.subTitle)}
                </div>
                <div className={'col-xs-3'}>
                    {i18n.t(i18nKeys.validationRulesAnalysis.details.rule.nameLabel)}
                </div>
                <div className={'col-xs-9'}>
                    {this.state.rule.displayName}
                </div>
                <div className={'col-xs-3'}>
                    {i18n.t(i18nKeys.validationRulesAnalysis.details.rule.descriptionLabel)}
                </div>
                <div className={'col-xs-9'}>
                    {this.state.rule.displayDescription}
                </div>
            </div>
        );

        const showNoData = side => (
            <div className={classNames('row', styles.sectionBox)}>
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {side}
                </div>
                <div className={classNames('col-xs-12', cssPageStyles.center)}>
                    <div className={styles.noData}>{i18n.t(i18nKeys.validationRulesAnalysis.details.noData)}</div>
                </div>
            </div>
        );

        const buildSection = (side, elements, classNameRow) =>
            (
                <div className={classNames('row', classNameRow, styles.sectionBox)}>
                    <div className={classNames('col-xs-12', styles.sectionTitle)}>
                        {side}
                    </div>
                    <div className={classNames('col-xs-10', styles.sectionSubTitle)}>
                        {i18n.t(i18nKeys.validationRulesAnalysis.details.dataElementLabel)}
                    </div>
                    <div className={classNames('col-xs-2', styles.sectionSubTitle, cssPageStyles.right)}>
                        {i18n.t(i18nKeys.validationRulesAnalysis.details.valueLabel)}
                    </div>
                    {
                        elements.map(element =>
                            (
                                <div key={element.name} className={'col-xs-12'}>
                                    <div className={'row'}>
                                        <div className={'col-xs-10'}>
                                            {element.name}
                                        </div>
                                        <div className={classNames('col-xs-2', cssPageStyles.right)}>
                                            {element.value ? <FormattedNumber value={Number(element.value)} /> : '-'}
                                        </div>
                                    </div>
                                </div>
                            ),
                        )
                    }
                </div>
            );

        return (
            <div>
                <FontIcon
                    key={`FI|${this.props.organisationUnitId}-${this.props.periodId}-${this.props.validationRuleId}`}
                    className={'validation-rules-show-details-action material-icons'}
                    style={jsPageStyles.cursorStyle}
                    onClick={this.loadDetails}
                >
                    info
                </FontIcon>
                <Dialog
                    className="validation-rules-details-dialog"
                    key={`D${this.props.organisationUnitId}-${this.props.periodId}-${this.props.validationRuleId}`}
                    autoScrollBodyContent={Boolean(true)}
                    title={i18n.t(i18nKeys.validationRulesAnalysis.details.dialogTitle)}
                    actions={dialogActions}
                    modal={Boolean(true)}
                    open={this.state.openDetails}
                    onRequestClose={this.handleClose}
                >
                    {/* Result */}
                    {result}
                    {/* Left Side */}
                    {
                        this.state.expression.leftSide && this.state.expression.leftSide.length > 0 ?
                            buildSection(
                                i18n.t(i18nKeys.validationRulesAnalysis.details.leftSideSectionTitle),
                                this.state.expression.leftSide,
                                'left-side-row',
                            ) : (
                                showNoData(i18n.t(i18nKeys.validationRulesAnalysis.details.leftSideSectionTitle))
                            )
                    }
                    {/* Right Side */}
                    {
                        this.state.expression.rightSide && this.state.expression.rightSide.length > 0 ?
                            buildSection(
                                i18n.t(i18nKeys.validationRulesAnalysis.details.rightSideSectionTitle),
                                this.state.expression.rightSide,
                                'right-side-row',
                            ) : (
                                showNoData(i18n.t(i18nKeys.validationRulesAnalysis.details.rightSideSectionTitle))
                            )
                    }
                </Dialog>
            </div>
        );
    }
}

export default ValidationRulesDetails;
