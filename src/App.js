// Due to the way translations are handled in src/pages/sections.conf.js,
// src/locales/index.js must be the first import in this file
import './locales'
import './grid.css'

import { CssVariables } from '@dhis2/ui'
import { MuiThemeProvider } from 'material-ui/styles'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import 'material-design-icons-iconfont'
import App from './components/App/App'
import appTheme from './theme'

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
