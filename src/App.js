import { CssVariables } from '@dhis2/ui'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import 'material-design-icons-iconfont'
import App from './components/App/App'
import appTheme from './theme'
import './grid.css'
import './locales'

const AppWrapper = () => (
    <>
        <CssVariables spacers colors />
        <MuiThemeProvider muiTheme={appTheme}>
            <HashRouter>
                <App />
            </HashRouter>
        </MuiThemeProvider>
    </>
)

export default AppWrapper
