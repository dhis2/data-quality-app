import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { withRouter } from 'react-router-dom'
import AppRouter from '../AppRouter/AppRouter'
import Sidebar from '../Sidebar/Sidebar'
import styles from './App.module.css'

class App extends PureComponent {
    static childContextTypes = {
        d2: PropTypes.object,
        updateAppState: PropTypes.func,
    }

    constructor(props) {
        super(props)

        this.state = {
            pageState: {},
        }
    }

    getChildContext() {
        return {
            d2: this.props.d2,
            updateAppState: this.updateAppState,
        }
    }

    updateAppState = appState => {
        // TODO: Replace with history.listen
        // https://github.com/ReactTraining/history/blob/master/docs/getting-started.md#listening
        /*if (
            appState.currentSection &&
            !appState.pageState &&
            this.state.currentSection !== appState.currentSection
        ) {
            // clear page state because we are updating page
            this.setState({ ...appState, pageState: {} })
        } else {
            this.setState(appState)
        }*/
        this.setState(appState)
    }

    render() {
        const showSidebar = !this.state.pageState?.showTable

        return (
            <div className={styles.container}>
                {showSidebar && (
                    <div className={styles.sidebar}>
                        <Sidebar />
                    </div>
                )}
                <div className={styles.content}>
                    <div className={styles.contentWrapper}>
                        <AppRouter pageState={this.state.pageState} />
                    </div>
                </div>
            </div>
        )
    }
}

App.propTypes = {
    d2: PropTypes.object,
}

export default withRouter(App)
