import i18n from '@dhis2/d2-i18n'
import classNames from 'classnames'
import { Dialog, FlatButton, FontIcon } from 'material-ui'
import PropTypes from 'prop-types'
import React from 'react'
import FormattedNumber from '../../../components/formatters/FormattedNumber'
import { apiConf } from '../../../server.conf'
import Page from '../../Page'
import cssPageStyles from '../../Page.module.css'
import jsPageStyles from '../../PageStyles'
import ValidationRulesAnalysis from '../ValidationRulesAnalysis'
import styles from './ValidationRulesDetails.module.css'

class ValidationRulesDetails extends Page {
    static STATE_PROPERTIES = ['loading']

    static propTypes = {
        validationRuleId: PropTypes.string.isRequired,
        periodId: PropTypes.string.isRequired,
        organisationUnitId: PropTypes.string.isRequired,
        attributeOptionComboId: PropTypes.string.isRequired,
    }

    constructor() {
        super()

        this.state = {
            loading: false,
            openDetails: false,
            rule: {},
            expression: {
                leftSide: [],
                rightSide: [],
            },
        }

        this.loadDetails = this.loadDetails.bind(this)
        this.handleClose = this.handleClose.bind(this)
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const nextState = {}

        Object.keys(nextProps).forEach(property => {
            if (
                nextProps.hasOwnProperty(property) &&
                ValidationRulesAnalysis.STATE_PROPERTIES.includes(property)
            ) {
                nextState[property] = nextProps[property]
            }
        })

        if (nextState !== {}) {
            this.setState(nextState)
        }
    }

    loadDetails() {
        if (!this.state.loading) {
            const api = this.context.d2.Api.getApi()
            const requestRule = `${apiConf.endpoints.validationRules}/${this.props.validationRuleId}`
            const requestExpression =
                `${apiConf.endpoints.validationRulesExpression}` +
                `?validationRuleId=${this.props.validationRuleId}` +
                `&periodId=${this.props.periodId}` +
                `&organisationUnitId=${this.props.organisationUnitId}` +
                `&attributeOptionComboId=${this.props.attributeOptionComboId}`
            this.context.updateAppState({
                pageState: {
                    loading: true,
                },
            })
            Promise.all([api.get(requestRule), api.get(requestExpression)])
                .then(([rule, expression]) => {
                    this.context.updateAppState({
                        pageState: {
                            loading: false,
                        },
                    })
                    this.setState({ openDetails: true, rule, expression })
                })
                .catch(() => {
                    this.manageError()
                })
        }
    }

    handleClose() {
        this.setState({ openDetails: false })
    }

    render() {
        // Details Actions
        const dialogActions = [
            <FlatButton
                className="close-action"
                key={`FB${this.props.organisationUnitId}-${this.props.periodId}-${this.props.validationRuleId}`}
                label={i18n.t('Close')}
                primary={Boolean(true)}
                onClick={this.handleClose}
            />,
        ]

        const result = (
            <div
                className={classNames('row', 'results-row', styles.sectionBox)}
            >
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {i18n.t('VALIDATIONS RESULT DETAILS')}
                </div>
                <div
                    className={classNames('col-xs-12', styles.sectionSubTitle)}
                >
                    {i18n.t('VALIDATION RULE')}
                </div>
                <div className={'col-xs-3'}>{i18n.t('Name')}</div>
                <div className={'col-xs-9'}>{this.state.rule.displayName}</div>
                <div className={'col-xs-3'}>{i18n.t('Description')}</div>
                <div className={'col-xs-9'}>
                    {this.state.rule.displayDescription}
                </div>
            </div>
        )

        const showNoData = side => (
            <div className={classNames('row', styles.sectionBox)}>
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {side}
                </div>
                <div className={classNames('col-xs-12', cssPageStyles.center)}>
                    <div className={styles.noData}>
                        {i18n.t('no data available')}
                    </div>
                </div>
            </div>
        )

        const buildSection = (side, elements, classNameRow) => (
            <div className={classNames('row', classNameRow, styles.sectionBox)}>
                <div className={classNames('col-xs-12', styles.sectionTitle)}>
                    {side}
                </div>
                <div
                    className={classNames('col-xs-10', styles.sectionSubTitle)}
                >
                    {i18n.t('DATA ELEMENT')}
                </div>
                <div
                    className={classNames(
                        'col-xs-2',
                        styles.sectionSubTitle,
                        cssPageStyles.right
                    )}
                >
                    {i18n.t('VALUE')}
                </div>
                {elements.map(element => (
                    <div key={element.name} className={'col-xs-12'}>
                        <div className={'row'}>
                            <div className={'col-xs-10'}>{element.name}</div>
                            <div
                                className={classNames(
                                    'col-xs-2',
                                    cssPageStyles.right
                                )}
                            >
                                {element.value ? (
                                    <FormattedNumber
                                        value={Number(element.value)}
                                    />
                                ) : (
                                    '-'
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )

        return (
            <div>
                <FontIcon
                    key={`FI|${this.props.organisationUnitId}-${this.props.periodId}-${this.props.validationRuleId}`}
                    className={
                        'validation-rules-show-details-action material-icons'
                    }
                    style={jsPageStyles.cursorStyle}
                    onClick={this.loadDetails}
                >
                    info
                </FontIcon>
                <Dialog
                    className="validation-rules-details-dialog"
                    key={`D${this.props.organisationUnitId}-${this.props.periodId}-${this.props.validationRuleId}`}
                    autoScrollBodyContent={Boolean(true)}
                    title={i18n.t('Validation Details')}
                    actions={dialogActions}
                    modal={Boolean(true)}
                    open={this.state.openDetails}
                    onRequestClose={this.handleClose}
                >
                    {/* Result */}
                    {result}
                    {/* Left Side */}
                    {this.state.expression.leftSide &&
                    this.state.expression.leftSide.length > 0
                        ? buildSection(
                              i18n.t('LEFT SIDE'),
                              this.state.expression.leftSide,
                              'left-side-row'
                          )
                        : showNoData(i18n.t('LEFT SIDE'))}
                    {/* Right Side */}
                    {this.state.expression.rightSide &&
                    this.state.expression.rightSide.length > 0
                        ? buildSection(
                              i18n.t('RIGHT SIDE'),
                              this.state.expression.rightSide,
                              'right-side-row'
                          )
                        : showNoData(i18n.t('RIGHT SIDE'))}
                </Dialog>
            </div>
        )
    }
}

export default ValidationRulesDetails
