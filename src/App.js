import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/* d2-ui */
import D2UIApp from '@dhis2/d2-ui-app';
import HeaderBar from '@dhis2/d2-ui-header-bar';
import { Sidebar, FeedbackSnackbar, CircularProgress } from '@dhis2/d2-ui-core';

/* Redux */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { updateFeedbackState } from './reducers/feedback';

import { LOADING } from './helpers/feedbackSnackBarTypes';

import i18n from './locales';

import AppRouter from './components/app-router/AppRouter';

import './custom-css/D2UISidebarOverrides.css';
import styles from './App.css';

// App configs
import { sections } from './pages/sections.conf';

class App extends PureComponent {
    static childContextTypes = {
        d2: PropTypes.object.isRequired,
        currentSection: PropTypes.string,
        updateAppState: PropTypes.func,
    };

    static propTypes = {
        d2: PropTypes.object.isRequired,
        showSnackbar: PropTypes.bool.isRequired,
        snackbarConf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
            action: PropTypes.string,
            onActionClick: PropTypes.func,
        }).isRequired,
        updateFeedbackState: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            pageState: {},
        };

        this.updateAppState = this.updateAppState.bind(this);
    }

    getChildContext() {
        return {
            d2: this.props.d2,
            currentSection: this.state.currentSection,
            updateAppState: this.updateAppState,
        };
    }

    onFeedbackSnackbarClose = () => {
        this.props.updateFeedbackState(false, {
            type: '',
            message: '',
        });
    };

    updateAppState(appState) {
        if (appState.currentSection
            && !appState.pageState
            && this.state.currentSection !== appState.currentSection) {
            // clear page state because we are updating page
            this.setState({ ...appState, pageState: {}, showSnackbar: false });
        } else {
            this.setState(appState);
        }
    }

    render() {
        const nonOnChangeSection = () => null;
        const translatedSections = sections.map(section => Object.assign(
            section,
            {
                icon: section.info.icon,
                label: i18n.t(section.info.label),
                containerElement: <Link to={section.path} />,
            },
        ));

        const feedbackElement = this.props.snackbarConf.type === LOADING ?
            (
                <div className={styles.centered}>
                    <CircularProgress />
                </div>
            ) : (
                <FeedbackSnackbar
                    onClose={this.onFeedbackSnackbarClose}
                    show={this.props.showSnackbar}
                    conf={this.props.snackbarConf}
                />
            );

        return (
            <D2UIApp>
                <HeaderBar d2={this.props.d2} />
                <Sidebar
                    sections={translatedSections}
                    currentSection={this.state.currentSection}
                    onChangeSection={nonOnChangeSection}
                />
                <div className={styles.contentWrapper}>
                    <div className={styles.contentArea}>
                        <AppRouter
                            pageState={this.state.pageState}
                        />
                    </div>
                </div>
                <div id="feedback-snackbar">
                    {feedbackElement}
                </div>
            </D2UIApp>
        );
    }
}

const mapStateToProps = ({ feedback }) => ({
    showSnackbar: feedback.showSnackbar,
    snackbarConf: { ...feedback.snackbarConf },
});

const mapDispatchToProps = dispatch => bindActionCreators({
    updateFeedbackState,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
