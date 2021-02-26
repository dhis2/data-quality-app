import Sidebar from 'd2-ui/lib/sidebar/Sidebar.component'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { sections } from '../../pages/sections.conf'
import AppRouter from '../app-router/AppRouter'
import styles from './App.module.css'

const noop = () => null

class App extends PureComponent {
    static childContextTypes = {
        d2: PropTypes.object,
        currentSection: PropTypes.string,
        showSnackbar: PropTypes.bool,
        snackbarConf: PropTypes.shape({
            message: PropTypes.string,
            type: PropTypes.string,
        }),
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
        const translatedSections = sections.map(section => ({
            ...section,
            icon: section.info.icon,
            label: section.info.label(),
            containerElement: <Link to={section.path} />,
        }))

        const showSidebar = !this.state.pageState?.showTable

        return (
            <div className={styles.container}>
                {showSidebar && (
                    <Sidebar
                        sections={translatedSections}
                        currentSection={this.state.currentSection}
                        onChangeSection={noop}
                    />
                )}
                <div className={styles.contentArea}>
                    <AppRouter pageState={this.state.pageState} />
                </div>
            </div>
        )
    }
}

App.propTypes = {
    d2: PropTypes.object,
}

export default withRouter(App)
