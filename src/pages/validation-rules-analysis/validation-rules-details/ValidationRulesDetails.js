import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, FlatButton, FontIcon } from 'material-ui';

import classNames from 'classnames';

import styles from './ValidationRulesDetails.css';

// i18n
import { i18nKeys } from '../../../i18n';
import jsPageStyles from '../../PageStyles';
import cssPageStyles from '../../Page.css';

import FormattedNumber from '../../../components/formatters/FormattedNumber';

class ValidationRulesDetails extends React.Component {
    static propTypes = {
        details: PropTypes.object.isRequired,
    }

    static contextTypes = {
        translator: PropTypes.func,
    }

    constructor(props) {
        super(props);

        this.state = {
            open: false,
        };

        this.showDetails = this.showDetails.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    showDetails() {
        this.setState({ open: true });
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
                    {this.props.details.rule.name}
                </div>
                <div className={'col-xs-3'}>
                    {translator(i18nKeys.validationRulesAnalysis.details.rule.descriptionLabel)}
                </div>
                <div className={'col-xs-9'}>
                    {this.props.details.rule.description}
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
                    <div className={classNames('col-xs-2', styles.sectionSubTitle, cssPageStyles.number)}>
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
                                        <div className={classNames('col-xs-2', cssPageStyles.number)}>
                                            {element.value ? <FormattedNumber value={element.value} /> : '-'}
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
                    onClick={this.showDetails}
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
                            this.props.details.leftSide.dataElements,
                        )
                    }
                    {/* Right Side */}
                    {
                        buildSection(
                            translator(i18nKeys.validationRulesAnalysis.details.rightSideSectionTitle),
                            this.props.details.rightSide.dataElements,
                        )
                    }
                </Dialog>
            </div>
        );
    }
}

export default ValidationRulesDetails;
