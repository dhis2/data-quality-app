import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import App from './components/app/App'
import appTheme from './theme'
import './locales'

const AppWrapper = () => {
    const { d2 } = useD2()

    if (!d2) {
        return null
    }

    return (
        <MuiThemeProvider muiTheme={appTheme}>
            <HashRouter>
                <App d2={d2} />
            </HashRouter>
        </MuiThemeProvider>
    )
}

export default AppWrapper
