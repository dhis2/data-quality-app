import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, withRouter } from 'react-router-dom'
import { getUserSettings } from 'd2/lib/d2'
import D2UIApp from 'd2-ui/lib/app/D2UIApp'
import log from 'loglevel'
import { configI18n } from './configI18n'
import './index.css'
import App from './App'
import appTheme from './theme'
import * as serviceWorker from './serviceWorker'

import { Provider } from '@dhis2/app-runtime'
import { CssReset } from '@dhis2/ui-core'

log.setLevel(
    process.env.NODE_ENV === 'production' ? log.levels.INFO : log.levels.DEBUG
)

const AppComponent = withRouter(App)
const baseUrl = `${process.env.REACT_APP_DHIS2_BASE_URL}/api/${
    process.env.REACT_APP_DHIS2_API_VERSION
}`

const config = {
    baseUrl: process.env.REACT_APP_DHIS2_BASE_URL,
    apiVersion: process.env.REACT_APP_DHIS2_API_VERSION,
}

ReactDOM.render(
    <Provider config={config}>
        <CssReset />
        <D2UIApp
            muiTheme={appTheme}
            initConfig={{
                baseUrl,
                schemas: ['organisationUnit', 'dataSet', 'validationRuleGroup'],
            }}
        >
            <HashRouter>
                <AppComponent />
            </HashRouter>
        </D2UIApp>
    </Provider>,
    document.getElementById('root')
)

getUserSettings().then(userSettings => {
    const uiLocale = userSettings.keyUiLocale
    sessionStorage.setItem('uiLocale', uiLocale || 'en')

    configI18n(userSettings)
})

serviceWorker.unregister()
