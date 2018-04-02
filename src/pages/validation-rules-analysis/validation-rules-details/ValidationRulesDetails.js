import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, FontIcon } from 'material-ui';

import classNames from 'classnames';

import styles from './ValidationRulesDetails.css';

// i18n
import { i18nKeys } from '../../../i18n';
import jsPageStyles from '../../PageStyles';
import cssPageStyles from '../../Page.css';

import FormattedNumber from '../../../components/formatters/FormattedNumber';
import { apiConf } from '../../../server.conf';

class ValidationRulesDetails extends PureComponent {
    static propTypes = {
        validationRuleId: PropTypes.string.isRequired,
        periodId: PropTypes.string.isRequired,
        organisationUnitId: PropTypes.string.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
        d2: PropTypes.object,
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
            rule: {},
            expression: {
                leftSide: [],
                rightSide: [],
            },
        };

        this.loadDetails = this.loadDetails.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    loadDetails() {
        const api = this.context.d2.Api.getApi();
        const requestRule = `${apiConf.endpoints.validationRules}/${this.props.validationRuleId}`;
        const requestExpression = `${apiConf.endpoints.validationRulesExpression}` +
            `?validationRuleId=${this.props.validationRuleId}` +
            `&periodId=${this.props.periodId}` +
            `&organisationUnitId=${this.props.organisationUnitId}`;
        Promise.all([api.get(requestRule), api.get(requestExpression)]).then(([rule, expression]) => {
            this.setState({ open: true, rule, expression });
        }).catch(() => {
            // TODO
        });
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const translator = this.context.translator;

        // Details Actions
        const dialogActions = [
            <FlatButton
                label={translator(i18nKeys.validationRulesAnalysis.details.close)}
                primary={Boolean(true)}
                onClick={this.handleClose}
            />,
        ];

        const result = (
            <div className={classNames('row', styles.sectionBox)}>
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {translator(i18nKeys.validationRulesAnalysis.details.resultSectionTitle)}
                </div>
                <div className={classNames('col-xs-12', styles.sectionSubTitle)}>
                    {translator(i18nKeys.validationRulesAnalysis.details.rule.subTitle)}
                </div>
                <div className={'col-xs-3'}>
                    {translator(i18nKeys.validationRulesAnalysis.details.rule.nameLabel)}
                </div>
                <div className={'col-xs-9'}>
                    {this.state.rule.displayName}
                </div>
                <div className={'col-xs-3'}>
                    {translator(i18nKeys.validationRulesAnalysis.details.rule.descriptionLabel)}
                </div>
                <div className={'col-xs-9'}>
                    {this.state.rule.displayDescription}
                </div>
            </div>
        );

        const buildSection = (side, elements) =>
            (
                <div className={classNames('row', styles.sectionBox)}>
                    <div className={classNames('col-xs-12', styles.sectionTitle)}>
                        {side}
                    </div>
                    <div className={classNames('col-xs-10', styles.sectionSubTitle)}>
                        {translator(i18nKeys.validationRulesAnalysis.details.dataElementLabel)}
                    </div>
                    <div className={classNames('col-xs-2', styles.sectionSubTitle, cssPageStyles.right)}>
                        {translator(i18nKeys.validationRulesAnalysis.details.valueLabel)}
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
                    className={'material-icons'}
                    style={jsPageStyles.cursorStyle}
                    onClick={this.loadDetails}
                >
                    info
                </FontIcon>
                <Dialog
                    autoScrollBodyContent={Boolean(true)}
                    title={translator(i18nKeys.validationRulesAnalysis.details.dialogTitle)}
                    actions={dialogActions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    {/* Result */}
                    {result}
                    {/* Left Side */}
                    {
                        buildSection(
                            translator(i18nKeys.validationRulesAnalysis.details.leftSideSectionTitle),
                            this.state.expression.leftSide ? this.state.expression.leftSide : [],
                        )
                    }
                    {/* Right Side */}
                    {
                        buildSection(
                            translator(i18nKeys.validationRulesAnalysis.details.rightSideSectionTitle),
                            this.state.expression.rightSide ? this.state.expression.rightSide : [],
                        )
                    }
                </Dialog>
            </div>
        );
    }
}

export default ValidationRulesDetails;
