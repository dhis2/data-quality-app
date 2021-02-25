import CircularProgress from 'd2-ui/lib/circular-progress/CircularProgress'
import FeedbackSnackbar from 'd2-ui/lib/feedback-snackbar/FeedbackSnackbar.component'
import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { sections } from '../../pages/sections.conf'
import AppRouter from '../app-router/AppRouter'
import styles from './App.module.css'

// TODO: Fix imports

// TODO: Remove
import './custom-css/D2UISidebarOverrides.css'
import 'material-design-icons-iconfont'

import i18n from './locales'

class App extends PureComponent {
    static childContextTypes = {
        d2: PropTypes.object,
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.shape({
            type: PropTypes.string,
            message: PropTypes.string,
        }),
        currentSection: PropTypes.string,
        updateAppState: PropTypes.func,
    }

    constructor(props) {
        super(props)

        this.state = {
            currentSection: '',
            showSnackbar: false,
            snackbarConf: {
                type: '',
                message: '',
            },
            pageState: {},
        }
    }

    getChildContext() {
        return {
            d2: this.props.d2,
            showSnackbar: this.state.showSnackbar,
            snackbarConf: this.state.snackbarConf,
            currentSection: this.state.currentSection,
            updateAppState: this.updateAppState,
        }
    }

    updateAppState = appState => {
        if (
            appState.currentSection &&
            !appState.pageState &&
            this.state.currentSection !== appState.currentSection
        ) {
            // clear page state because we are updating page
            this.setState({ ...appState, pageState: {}, showSnackbar: false })
        } else {
            this.setState(appState)
        }
    }

    render() {
        const nonOnChangeSection = () => null
        const translatedSections = sections.map(section =>
            Object.assign(section, {
                icon: section.info.icon,
                label: section.info.label(),
                containerElement: <Link to={section.path} />,
            })
        )

        const feedbackElement = this.state.pageState.loading ? (
            <div className={styles.centered}>
                <CircularProgress />
            </div>
        ) : (
            <FeedbackSnackbar
                show={this.state.showSnackbar}
                conf={this.state.snackbarConf}
            />
        )

        const hideSidebar =
            this.state.pageState && this.state.pageState.showTable
        const contentWrapperClassName = hideSidebar
            ? styles.contentWrapperNoMargin
            : styles.contentWrapper

        return (
            <div>
                {!hideSidebar && (
                    <Sidebar
                        sections={translatedSections}
                        currentSection={this.state.currentSection}
                        onChangeSection={nonOnChangeSection}
                    />
                )}
                <div className={contentWrapperClassName}>
                    <div className={styles.contentArea}>
                        <AppRouter pageState={this.state.pageState} />
                    </div>
                </div>
                <div id="feedback-snackbar">{feedbackElement}</div>
            </div>
        )
    }
}

export default withRouter(App)
