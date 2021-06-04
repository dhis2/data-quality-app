import { useD2 } from '@dhis2/app-runtime-adapter-d2'
import { CssVariables } from '@dhis2/ui'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import 'material-design-icons-iconfont'
import App from './components/App/App'
import appTheme from './theme'
import './grid.css'
import './locales'

const AppWrapper = () => {
    const { d2 } = useD2()

    if (!d2) {
        return null
    }

    return (
        <>
            <CssVariables spacers colors />
            <MuiThemeProvider muiTheme={appTheme}>
                <HashRouter>
                    <App />
                </HashRouter>
            </MuiThemeProvider>
        </>
    )
}

export default AppWrapper
