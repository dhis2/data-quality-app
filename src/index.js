import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, withRouter } from 'react-router-dom'
import { getUserSettings, init } from 'd2/lib/d2'
import log from 'loglevel'
import { configI18n, injectTranslationsToD2 } from './configI18n'
import './index.css'
import App from './App'
import appTheme from './theme'
import * as serviceWorker from './serviceWorker'

import { Provider } from '@dhis2/app-runtime'
import { CssReset } from '@dhis2/ui-core'
import { MuiThemeProvider } from 'material-ui/styles'

log.setLevel(
    process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.DEBUG
)

const AppComponent = withRouter(App)
const baseUrl = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/${
    process.env.REACT_APP_DHIS2_API_VERSION
}`
const schemas = ['organisationUnit', 'dataSet', 'validationRuleGroup']

const config = {
    baseUrl: process.env.REACT_APP_DHIS2_BASE_URL,
    apiVersion: process.env.REACT_APP_DHIS2_API_VERSION,
}

const render = d2 =>
    ReactDOM.render(
        <Provider config={config}>
            <MuiThemeProvider muiTheme={appTheme}>
                <div>
                    <CssReset />
                    <HashRouter>
                        <AppComponent d2={d2} />
                    </HashRouter>
                </div>
            </MuiThemeProvider>
        </Provider>,
        document.getElementById('root')
    )

const start = async () => {
    const d2 = await init({ baseUrl, schemas })
    const userSettings = await getUserSettings()
    const uiLocale = userSettings.keyUiLocale

    sessionStorage.setItem('uiLocale', uiLocale || 'en')
    injectTranslationsToD2(d2)
    configI18n(userSettings)
    render(d2)
}

start()
serviceWorker.unregister()
